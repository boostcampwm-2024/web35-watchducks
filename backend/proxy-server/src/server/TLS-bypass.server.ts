import type { FastifyInstance } from 'fastify/types/instance';
import * as net from 'net';
import type { Socket } from 'net';

export async function createTLSHandshakeBypassServer(): Promise<void> {
    const server = net.createServer();
    const connections = new Set<Socket>();

    server.on('connection', async (clientSocket) => {
        connections.add(clientSocket);

        try {
            // TLS ClientHello 수신
            const tlsInfo = await receiveTLSInfo(clientSocket);
            if (!tlsInfo) {
                clientSocket.end();
                return;
            }

            // 대상 서버 연결
            const targetSocket = await connectToTarget(tlsInfo.serverName);

            // 핸드셰이크 패스스루
            await handleTLSHandshake(clientSocket, targetSocket, tlsInfo.clientHello);
        } catch (error) {
            console.error('Connection handling error:', error);
            clientSocket.destroy();
        } finally {
            connections.delete(clientSocket);
        }
    });

    server.on('error', (error) => {
        console.error('Server error:', error);
    });

    await new Promise<void>((resolve, reject) => {
        server
            .listen(process.env.BYPASS_PORT, () => {
                console.log(
                    `TLS Handshake Bypass Server listening on port ${process.env.BYPASS_PORT}`,
                );
                resolve();
            })
            .on('error', reject);
    });
}

// 헬퍼 함수들
async function receiveTLSInfo(
    socket: Socket,
): Promise<{ serverName?: string; clientHello: Buffer } | null> {
    const data = await new Promise<Buffer>((resolve) => {
        socket.once('data', resolve);
    });

    if (isTLSClientHello(data)) {
        const serverName = extractSNI(data);
        return { serverName, clientHello: data };
    }
    return null;
}

function isTLSClientHello(data: Buffer): boolean {
    return (
        data[0] === 0x16 && // Handshake
        data[1] === 0x03 && // SSL/TLS 버전
        data[5] === 0x01
    ); // ClientHello
}

function extractSNI(data: Buffer): string | undefined {
    try {
        let pos = 5; // TLS 레코드 헤더 건너뛰기

        // ClientHello 확인
        if (data[pos] !== 0x01) return undefined;

        // 길이 필드 건너뛰기
        pos += 4;

        // TLS 버전 건너뛰기
        pos += 2;

        // Random 건너뛰기
        pos += 32;

        // Session ID 건너뛰기
        const sessionIdLength = data[pos];
        pos += 1 + sessionIdLength;

        // Cipher Suites 건너뛰기
        const cipherSuitesLength = data.readUInt16BE(pos);
        pos += 2 + cipherSuitesLength;

        // Compression Methods 건너뛰기
        const compressionMethodsLength = data[pos];
        pos += 1 + compressionMethodsLength;

        // Extensions 파싱
        const extensionsLength = data.readUInt16BE(pos);
        pos += 2;

        const endPos = pos + extensionsLength;
        while (pos < endPos) {
            const extensionType = data.readUInt16BE(pos);
            const extensionLength = data.readUInt16BE(pos + 2);
            pos += 4;

            if (extensionType === 0) {
                // SNI extension
                pos += 2; // SNI 리스트 길이
                if (data[pos] === 0) {
                    // hostname type
                    pos += 1;
                    const hostnameLength = data.readUInt16BE(pos);
                    pos += 2;
                    return data.slice(pos, pos + hostnameLength).toString('utf8');
                }
            }
            pos += extensionLength;
        }

        return undefined;
    } catch (error) {
        console.error('Error extracting SNI:', error);
        return undefined;
    }
}

async function connectToTarget(serverName?: string): Promise<Socket> {
    return new Promise((resolve, reject) => {
        const targetSocket = net.connect(
            {
                host: '175.106.99.193', //serverName || 'default-target.com',
                port: 443,
            },
            () => resolve(targetSocket),
        );

        targetSocket.on('error', reject);
    });
}

async function handleTLSHandshake(
    clientSocket: Socket,
    targetSocket: Socket,
    clientHello: Buffer,
): Promise<void> {
    return new Promise((resolve, reject) => {
        console.log('target: ', targetSocket.remoteAddress, targetSocket.remotePort);

        targetSocket.write(clientHello);

        let handshakeMessages = 0; // 핸드셰이크 메시지 카운트

        const onClientData = (data: Buffer) => {
            console.log('Client Data:', data[0]);
            targetSocket.write(data);
        };

        const onTargetData = (data: Buffer) => {
            console.log('Target Data:', data[0]);
            clientSocket.write(data);

            if (data[0] === 22) {
                // Handshake message
                handshakeMessages++;

                // 일반적인 TLS 핸드셰이크는 여러 번의 메시지 교환이 필요
                if (handshakeMessages >= 2) {
                    // 충분한 메시지가 교환됨
                    cleanup();
                    switchToTCPProxy(clientSocket, targetSocket);
                    resolve();
                }
            }
        };

        const cleanup = () => {
            clientSocket.removeListener('data', onClientData);
            targetSocket.removeListener('data', onTargetData);
            clientSocket.removeListener('error', onError);
            targetSocket.removeListener('error', onError);
        };

        const onError = (error: Error) => {
            cleanup();
            reject(error);
        };

        clientSocket.on('data', onClientData);
        targetSocket.on('data', onTargetData);
        clientSocket.once('error', onError);
        targetSocket.once('error', onError);
    });
}

async function switchToTCPProxy(clientSocket: Socket, targetSocket: Socket): Promise<void> {
    console.log(clientSocket.remoteAddress, targetSocket.remoteAddress);

    clientSocket.pipe(targetSocket);
    targetSocket.pipe(clientSocket);

    // 소켓 에러 처리
    clientSocket.on('error', (err) => {
        console.error('Client Socket Error:', err);
        targetSocket.end();
    });

    targetSocket.on('error', (err) => {
        console.error('Target Socket Error:', err);
        clientSocket.end();
    });
}
