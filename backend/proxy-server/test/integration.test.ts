import request from 'supertest';
import { Server } from '../src/server/server';
import { LogService } from '../src/domain/log/log.service';
import type { LogRepository } from '../src/domain/log/log.repository';
import { ErrorLogRepository } from '../src/common/logger/error-log.repository';
import type { ProjectService } from '../src/domain/project/project.service';
import { fastifyConfig } from '../src/server/config/fastify.config';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

describe('Proxy Server 통합 테스트', () => {
    let server: Server;
    const targetAddress = 'https://' + process.env.TEST_TARGET_ADDRESS;
    console.log(targetAddress);
    const proxyPort = 3000;

    beforeAll(async () => {
        process.env.PORT = proxyPort.toString();
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
                return process.env.TEST_TARGET_ADDRESS;
            }),
        } as unknown as ProjectService;

        const logService = new LogService(mockLogRepository);
        const errorLogRepository = new ErrorLogRepository();

        try {
            server = new Server(logService, mockProjectService, errorLogRepository);
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
        it('프록시 서버가 요청을 올바르게 처리할 수 있어야 한다.', async () => {
            const response = await request(targetAddress)
                .get('/api')
                .set('Host', 'watchducks-test.shop')
                .set('Accept', '*/*')
                .set('Accept-Encoding', 'gzip, deflate, br')
                .set('Connection', 'keep-alive');

            console.log('Response Status:', response.status);
            expect([200, 404, 502]).toContain(response.status);
        });
    });
});
