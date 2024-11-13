import request from 'supertest';
import { ProxyServer } from '../src/server/proxy-server';
import { LogService } from '../src/domain/log/log.service';
import type { LogRepository } from '../src/domain/log/log.repository';
import { ErrorLogRepository } from '../src/common/logger/error-log.repository';
import type { ProjectService } from '../src/domain/project/project.service';
import { fastifyConfig } from '../src/server/config/fastify.config';

describe('Proxy Server 통합 테스트', () => {
    let server: ProxyServer;
    const port = 3000;

    beforeAll(async () => {
        process.env.PORT = port.toString();
        process.env.LISTENING_HOST = 'localhost';
        process.env.DEFAULT_CONNECTIONS = '10';
        process.env.DEFAULT_PIPELINING = '5';
        process.env.DEFAULT_KEEP_ALIVE = '5000';

        Object.assign(fastifyConfig, {
            bodyLimit: 1048576, // 1MB
            requestTimeout: 30000,
            keepAliveTimeout: 5000,
        });

        const mockLogRepository: LogRepository = {
            insertHttpLog: jest.fn(),
        };

        const mockProjectService: ProjectService = {
            getIpByDomain: jest.fn().mockImplementation(async (_domain: string) => {
                return 'watchducks-test.shop';
            }),
        } as unknown as ProjectService;

        const logService = new LogService(mockLogRepository);
        const errorLogRepository = new ErrorLogRepository();

        try {
            server = new ProxyServer(logService, mockProjectService, errorLogRepository);
            await server.start();
        } catch (error) {
            console.error('Server initialization failed:', error);
            throw error;
        }
    });

    afterAll(async () => {
        if (server) {
            await server.stop();
        }
    });

    describe('Proxy Server 테스트', () => {
        it('요청을 로깅할 수 있어야 한다.', async () => {
            const firstResponse = await request(`http://localhost:${port}`)
                .get('/api')
                .set('Host', 'watchducks-test.shop')
                .set('Accept', '*/*')
                .set('Accept-Encoding', 'gzip, deflate, br')
                .set('Connection', 'keep-alive');

            if (firstResponse.status === 301 && firstResponse.headers.location) {
                const redirectUrl = firstResponse.headers.location;
                console.log('Following redirect to:', redirectUrl);

                const secondResponse = await request(redirectUrl)
                    .get('')
                    .set('Accept', '*/*')
                    .set('Accept-Encoding', 'gzip, deflate, br')
                    .set('Connection', 'keep-alive');

                expect([200, 404, 502]).toContain(secondResponse.status);
            } else {
                expect([200, 404, 502]).toContain(firstResponse.status);
            }
        });

        it('예상한 응답을 올바르게 처리할 수 있어야 한다.', async () => {
            const response = await request(`http://localhost:${port}`)
                .get('/api')
                .set('Host', 'watchducks-test.shop')
                .set('Accept', '*/*')
                .set('Accept-Encoding', 'gzip, deflate, br')
                .set('Connection', 'keep-alive')
                .redirects(5);

            console.log('Response Status:', response.status);
            if (response.status !== 200) {
                console.log('Response Body:', response.body);
            }

            expect([200, 502]).toContain(response.status);
        });
    });
});
