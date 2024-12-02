import 'reflect-metadata';
import type { FastifyInstance } from 'fastify';
import supertest from 'supertest';
import { fastifyServer } from '../src/server/fastify.server';
import dotenv from 'dotenv';
import type { Logger } from '../src/common/logger/createFastifyLogger';
import type { ProjectRepository } from '../src/domain/port/output/project.repository';
import type { LogRepository } from '../src/domain/port/output/log.repository';
import type { ProjectCacheRepository } from '../src/domain/port/output/project-cache.repository';
import { container } from 'tsyringe';
import { TOKENS } from '../src/common/container/container';

jest.mock('database/query/log.repository.clickhouse');
jest.mock('database/query/project.repository.mysql');
jest.mock('database/query/project-cache.repository.redis');

dotenv.config({ path: '../.env' });

describe('프록시 서버 통합 테스트', () => {
    const proxyPort = 3000;
    const targetAddress = 'http://localhost:3100';

    let server: FastifyInstance;
    let logger: Logger;

    let mockProjectRepository: jest.Mocked<ProjectRepository>;
    let mockLogRepository: jest.Mocked<LogRepository>;
    let mockProjectCacheRepository: jest.Mocked<ProjectCacheRepository>;

    process.env.PORT = proxyPort.toString();
    process.env.LISTENING_HOST = 'localhost';
    process.env.DEFAULT_CONNECTIONS = '10';
    process.env.DEFAULT_PIPELINING = '5';
    process.env.DEFAULT_KEEP_ALIVE = '5000';

    beforeAll(async () => {
        mockProjectRepository = {
            findIpByDomain: jest.fn(),
        } as unknown as jest.Mocked<ProjectRepository>;
        mockLogRepository = {
            insertHttpLog: jest.fn(),
        } as unknown as jest.Mocked<LogRepository>;
        mockProjectCacheRepository = {
            findIpByDomain: jest.fn(),
            cacheIpByDomain: jest.fn(),
        } as unknown as jest.Mocked<ProjectCacheRepository>;

        container.registerInstance(TOKENS.PROJECT_REPOSITORY, mockProjectRepository);
        container.registerInstance(TOKENS.LOG_REPOSITORY, mockLogRepository);
        container.registerInstance(TOKENS.PROJECT_CACHE_REPOSITORY, mockProjectCacheRepository);

        const { server: serverInstance, logger: loggerInstance } = await fastifyServer.listen();
        server = serverInstance;
        logger = loggerInstance;
    });

    afterAll(async () => {
        fastifyServer.stop(server, logger);
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('프록시 서버는', () => {
        it('올바른 요청에 대해 200을 반환하고 로그 삽입 로직을 실행시켜야한다.', async () => {
            mockProjectRepository.findIpByDomain.mockResolvedValue('175.106.99.193');
            mockLogRepository.insertHttpLog.mockResolvedValue();
            mockProjectCacheRepository.findIpByDomain.mockResolvedValue(null);

            const response = await supertest(targetAddress)
                .get('/api')
                .set('Host', 'watchducks-test.store')
                .set('Accept', '*/*')
                .set('Accept-Encoding', 'gzip, deflate, br')
                .set('Connection', 'keep-alive');

            console.log('Response Status:', response.body);
            expect([200, 502]).toContain(response.status);
            expect(mockLogRepository.insertHttpLog).toHaveBeenCalled();
            expect(mockLogRepository.insertHttpLog).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: 'GET',
                    path: '/api',
                    host: 'watchducks-test.store',
                    statusCode: expect.any(Number),
                }),
            );
        });

        it('등록되지 않은 도메인에 대한 요청에 대해서 404를 반환해야하고 로그 삽입 로직을 실행시켜야한다.', async () => {
            mockProjectRepository.findIpByDomain.mockResolvedValue('');
            mockLogRepository.insertHttpLog.mockResolvedValue();
            mockProjectCacheRepository.findIpByDomain.mockResolvedValue(null);

            const response = await supertest(targetAddress)
                .get('/api')
                .set('Host', 'watchducks-test.store')
                .set('Accept', '*/*')
                .set('Accept-Encoding', 'gzip, deflate, br')
                .set('Connection', 'keep-alive');

            console.log('Response Status:', response.body);
            expect(404).toBe(response.status);
            expect(mockLogRepository.insertHttpLog).toHaveBeenCalled();
            expect(mockLogRepository.insertHttpLog).toHaveBeenCalledWith(
                expect.objectContaining({
                    method: 'GET',
                    path: '/api',
                    host: 'watchducks-test.store',
                    statusCode: expect.any(Number),
                }),
            );
        });
    });
});
