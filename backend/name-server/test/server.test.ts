import * as dgram from 'dgram';
import { encode, decode, Packet } from 'dns-packet';
import { Server } from '../src/server/server';
import { ServerConfig } from '../src/common/utils/validator/configuration.validator';
import { NORMAL_PACKET, NOT_EXIST_DOMAIN_PACKET } from './constant/packet';
import { ProjectQuery } from '../src/database/query/project.query';
import { DAURecorder } from '../src/database/query/dau-recorder';

describe('DNS 서버는 ', () => {
    let server: Server;
    let client: dgram.Socket;

    const TEST_PORT = 53535;
    const TEST_HOST = '127.0.0.1';
    const TEST_PROXY_SERVER_IP = '127.1.1.1';

    const config: ServerConfig = {
        proxyServerIp: TEST_PROXY_SERVER_IP,
        nameServerPort: TEST_PORT,
    } as unknown as ServerConfig;

    beforeAll(async () => {
        client = dgram.createSocket('udp4');

        server = new Server(config, new DAURecorder(), new ProjectQuery());
        server.start();

        await new Promise((resolve) => setTimeout(resolve, 100));
    });

    afterAll(() => {
        server.stop();
        client.close();
    });

    const sendQuery = (packet: Packet): Promise<any> => {
        return new Promise((resolve, reject) => {
            const queryBuffer = encode(packet);

            client.once('message', (msg) => {
                try {
                    const response = decode(msg);
                    resolve(response);
                } catch (error) {
                    reject(error);
                }
            });

            client.send(queryBuffer, TEST_PORT, TEST_HOST, (error) => {
                if (error) reject(error);
            });
        });
    };

    it('정상적인 도메인 네임 요청을 받으면 NOERROR 플래그를 응답해야합니다.', async () => {
        const response = await sendQuery(NORMAL_PACKET);

        expect(response.rcode).toBe('NOERROR');
        expect(response.answers.length).toBeGreaterThan(0);
        expect(response.answers[0].type).toBe('A');
        expect(response.answers[0].data).toBe(config.proxyServerIp);
    });

    it('비정상적인 도메인 네임(없는 도메인 네임) 요청을 받으면 NXDOMAIN 플래그를 응답해야합니다.', async () => {
        const response = await sendQuery(NOT_EXIST_DOMAIN_PACKET);

        expect(response.rcode).toBe('NXDOMAIN');
        expect(response.answers.length).toBe(0);
    });

    it('정상적인 DNS 응답 구조로 응답해야합니다.', async () => {
        const response = await sendQuery(NORMAL_PACKET);

        expect(response).toMatchObject({
            type: 'response',
            id: expect.any(Number),
            flags: expect.any(Number),
            questions: expect.arrayContaining([
                expect.objectContaining({
                    type: 'A',
                    name: 'example.com',
                    class: 'IN',
                }),
            ]),
            answers: expect.arrayContaining([
                expect.objectContaining({
                    type: 'A',
                    name: 'example.com',
                    class: 'IN',
                    ttl: expect.any(Number),
                    data: config.proxyServerIp,
                }),
            ]),
        });
    });
});
