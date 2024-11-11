import { FastifyLogger } from '../../src/common/logger/fastify.logger';
import type { FastifyInstance } from 'fastify';
import type { RequestLog, ResponseLog, ErrorLog } from '../../src/common/interface/log.interface';

describe('proxy-server-fastify 테스트', () => {
    let mockServer: FastifyInstance;
    let logger: FastifyLogger;

    beforeEach(() => {
        mockServer = {
            log: {
                info: jest.fn(),
                error: jest.fn(),
            },
        } as unknown as FastifyInstance;

        logger = new FastifyLogger(mockServer);
    });

    describe('info()는 ', () => {
        it('요청 정보를 올바르게 로깅해야한다.', () => {
            const requestLog: RequestLog = {
                message: 'Request received',
                method: 'GET',
                hostname: 'api.example.com',
                url: '/api/v1/users',
                path: '/api/v1/users',
            };

            logger.info(requestLog);

            expect(mockServer.log.info).toHaveBeenCalledWith(requestLog);
        });

        it('응답 정보를 올바르게 로깅해야한다.', () => {
            const responseLog: ResponseLog = {
                message: 'Response completed',
                method: 'POST',
                hostname: 'api.example.com',
                url: '/api/v1/users',
                path: '/api/v1/users',
                statusCode: 201,
                statusMessage: 'Created',
                responseTime: 123,
            };

            logger.info(responseLog);

            expect(mockServer.log.info).toHaveBeenCalledWith(responseLog);
        });
    });

    describe('error()는 ', () => {
        it('오류 정보를 올바르게 로깅해야 한다.', () => {
            const originalError = new Error('Connection timeout');
            const errorLog: ErrorLog = {
                message: 'Database connection failed',
                method: 'GET',
                hostname: 'api.example.com',
                url: '/api/v1/users',
                path: '/api/v1/users',
                request: {
                    method: 'GET',
                    hostname: 'api.example.com',
                    url: '/api/v1/users',
                    path: '/api/v1/users',
                    headers: {
                        'content-type': 'application/json',
                        'user-agent': 'test-client/1.0',
                    },
                },
                error: {
                    message: 'Connection timeout',
                    name: 'Error',
                    stack: originalError.stack,
                    originalError,
                },
            };

            logger.error(errorLog);

            expect(mockServer.log.error).toHaveBeenCalledWith(errorLog);
        });
    });
});
