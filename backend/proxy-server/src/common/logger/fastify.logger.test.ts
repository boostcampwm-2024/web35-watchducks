import type { FastifyInstance } from 'fastify';
import type { HttpLogEntity } from 'domain/entity/http-log.entity';
import type { Logger } from 'common/logger/createFastifyLogger';
import { createFastifyLogger } from 'common/logger/createFastifyLogger';

const mockFastifyInstance = {
    log: {
        info: jest.fn(),
        error: jest.fn(),
    },
} as unknown as FastifyInstance;

describe('FastifyLogger 테스트', () => {
    let logger: Logger;

    beforeEach(() => {
        jest.clearAllMocks();
        logger = createFastifyLogger(mockFastifyInstance);
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

        it('단순 메시지를 올바르게 처리해야 한다.', () => {
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
                path: '/test',
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
