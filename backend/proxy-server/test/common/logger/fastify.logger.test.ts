import type { FastifyInstance } from 'fastify';
import { FastifyLogger } from '../../../src/common/logger/fastify.logger';
import type { HttpLogEntity } from '../../../src/domain/log/http-log.entity';

const mockFastifyInstance = {
    log: {
        info: jest.fn(),
        error: jest.fn(),
    },
} as unknown as FastifyInstance;

describe('FastifyLogger 테스트', () => {
    let logger: FastifyLogger;

    beforeEach(() => {
        jest.clearAllMocks();
        logger = new FastifyLogger(mockFastifyInstance);
    });

    describe('info()는 ', () => {
        it('응답 로그를 올바르게 처리해야 한다.', () => {
            const httpLog = {
                method: 'POST',
                host: 'www.example.com',
                path: '/test',
                statusCode: 200,
                responseTime: 100,
            } as HttpLogEntity;

            logger.info(httpLog);
            expect(mockFastifyInstance.log.info).toHaveBeenCalledWith(httpLog);
        });

        it('should log simple message', () => {
            const messageLog = { message: 'Test message' };

            logger.info(messageLog);
            expect(mockFastifyInstance.log.info).toHaveBeenCalledWith(messageLog);
        });
    });

    describe('error()는 ', () => {
        it('에러 로그 정보를 올바르게 처리해야 한다.', () => {
            const errorLog = {
                method: 'GET',
                host: 'www.example.com',
                request: {
                    method: 'POST',
                    host: 'localhost',
                    headers: {
                        'user-agent': 'test-agent',
                        'content-type': 'application/json',
                    },
                },
                error: {
                    message: 'Test error',
                    name: 'Error',
                    stack: 'Error stack',
                },
            };

            logger.error(errorLog);
            expect(mockFastifyInstance.log.error).toHaveBeenCalledWith(errorLog);
        });
    });
});
