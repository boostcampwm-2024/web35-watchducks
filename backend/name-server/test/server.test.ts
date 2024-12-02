import * as dgram from 'dgram';
import type { DecodedPacket, Packet } from 'dns-packet';
import { encode, decode } from 'dns-packet';
import { Server } from '../src/server/server';
import type { ServerConfig } from '../src/common/utils/validator/configuration.validator';
import { NORMAL_PACKET, NOT_EXIST_DOMAIN_PACKET } from './constant/packet';
import { TestProjectQuery } from './database/test-project.query';
import { CacheQuery } from '../src/database/query/cache.query';
import { TestCacheQuery } from './database/test-cache.query';

interface ARecord {
    type: 'A';
    name: string;
    class: 'IN';
    ttl: number;
    data: string;
}

interface DNSResponse extends DecodedPacket {
    rcode: unknown;
    answers: ARecord[];
}

describe('DNS 서버는 ', () => {
    let server: Server;
    let client: dgram.Socket;

    const TEST_PORT = 53535;
    const TEST_HOST = '127.0.0.1';
    const TEST_PROXY_SERVER_IP = '127.1.1.1';
    const TEST_TTL = 86400;
    const TEST_AUTHORITATIVE_NAME_SERVERS = ['ns1.test-ns.com', 'ns2.test-ns.com'];
    const TEST_NAME_SERVER_IP = '192.0.0.1';
    const TEST_HEALTH_CHECK_IP = '192.0.0.2';
    const TEST_PROXY_HEALTH_CHECK_ENDPOINT = '/health-check';

    const config: ServerConfig = {
        nameServerPort: TEST_PORT,
        proxyServerIp: TEST_PROXY_SERVER_IP,
        healthCheckIp: TEST_HEALTH_CHECK_IP,
        ttl: TEST_TTL,
        authoritativeNameServers: TEST_AUTHORITATIVE_NAME_SERVERS,
        nameServerIp: TEST_NAME_SERVER_IP,
        proxyHealthCheckEndpoint: TEST_PROXY_HEALTH_CHECK_ENDPOINT,
    };

    beforeAll(async () => {
        client = dgram.createSocket('udp4');

        server = new Server(config, new TestProjectQuery(), new TestCacheQuery());
        server.start();

        await new Promise((resolve) => setTimeout(resolve, 1000));
    });

    afterAll(async () => {
        await new Promise<void>((resolve) => {
            server.stop();
            client.close(() => resolve());
        });
    });

    const sendQuery = (packet: Packet): Promise<DNSResponse> => {
        return new Promise((resolve, reject) => {
            const queryBuffer = encode(packet);

            client.once('message', (msg) => {
                try {
                    const response = decode(msg) as DNSResponse;
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
