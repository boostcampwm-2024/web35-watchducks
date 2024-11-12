import fs from 'fs';
import path from 'path';
import { LogService } from '../../src/domain/log/log.service';
import { DatabaseQueryError } from '../../src/common/error/database-query.error';
import type { RequestLog, ResponseLog, ErrorLog } from '../../src/domain/log/log.interface';

jest.mock('fs', () => ({
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
    promises: {
        appendFile: jest.fn(),
    },
}));

jest.mock('path', () => ({
    join: jest.fn(),
}));

const mockInsertRequestLog = jest.fn();
const mockInsertResponseLog = jest.fn();

jest.mock('../../src/database/query/log.query', () => {
    return {
        LogQuery: jest.fn().mockImplementation(() => ({
            insertRequestLog: mockInsertRequestLog,
            insertResponseLog: mockInsertResponseLog,
        })),
    };
});

describe('LogService 테스트', () => {
    let logService: LogService;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('initialization()는', () => {
        beforeEach(() => {
            jest.clearAllMocks();
        });

        it('로그 디렉토리가 없다면 생성해야한다.', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);

            new LogService();

            expect(fs.existsSync).toHaveBeenCalledWith('logs');
            expect(fs.mkdirSync).toHaveBeenCalledWith('logs');
        });

        it('로그 디렉토리가 이미 존재하는 경우 생성하지 않아야 한다.', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(true);

            new LogService();

            expect(fs.existsSync).toHaveBeenCalledWith('logs');
            expect(fs.mkdirSync).not.toHaveBeenCalled();
        });

        it('디렉토리 생성 중 발생하는 에러를 처리할 수 있어야 한다.', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);
            (fs.mkdirSync as jest.Mock).mockImplementation(() => {
                throw new Error('Failed to create directory');
            });

            const consoleSpy = jest.spyOn(console, 'error');

            new LogService();

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to create log directory:',
                expect.any(Error),
            );
        });

        it('로그 디렉토리 생성 시 권한 에러가 발생하면 에러를 처리할 수 있어야 한다.', () => {
            const permissionError = new Error('EACCES: permission denied');
            (fs.mkdirSync as jest.Mock).mockImplementation(() => {
                throw permissionError;
            });
            (fs.existsSync as jest.Mock).mockReturnValue(false);

            const consoleSpy = jest.spyOn(console, 'error');

            new LogService();

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to create log directory:',
                permissionError,
            );
        });
    });

    describe('saveRequestLog()는', () => {
        beforeEach(() => {
            logService = new LogService();
        });

        it('성공적으로 requestLog를 저장해야 한다.', async () => {
            const requestLog: RequestLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
            };
            await logService.saveRequestLog(requestLog);

            expect(mockInsertRequestLog).toHaveBeenCalledWith(requestLog);
        });

        it('databaseQueryError 발생 시, 그대로 DatabaseQueryError를 던져야 한다.', async () => {
            const requestLog: RequestLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
            };

            const databaseQueryError = new DatabaseQueryError(new Error('Original DB Error'));
            mockInsertRequestLog.mockRejectedValue(databaseQueryError);

            await expect(logService.saveRequestLog(requestLog)).rejects.toBe(databaseQueryError);
        });

        it('일반 에러가 발생하면 DatabaseQueryError로 감싸서 throw해야 한다.', async () => {
            const requestLog: RequestLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
            };

            const originalError = new Error('DB Error');
            mockInsertRequestLog.mockRejectedValue(originalError);

            try {
                await logService.saveRequestLog(requestLog);
                fail('에러가 발생해야 합니다.');
            } catch (error) {
                expect(error).toBeInstanceOf(DatabaseQueryError);
                const dbError = error as DatabaseQueryError;
                expect(dbError.message).toBe('데이터베이스 쿼리 중 문제가 발생했습니다.');
                expect(dbError.originalError).toBe(originalError);
            }
        });
    });

    describe('saveResponseLog()는', () => {
        beforeEach(() => {
            logService = new LogService();
        });

        it('responseLog를 올바르게 저장해야 한다.', async () => {
            const responseLog: ResponseLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
                statusCode: 200,
                responseTime: 100,
            };

            await logService.saveResponseLog(responseLog);

            expect(mockInsertResponseLog).toHaveBeenCalledWith(responseLog);
        });

        it('DatabaseQueryError가 발생하면 그대로 throw해야 한다.', async () => {
            const responseLog: ResponseLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
                statusCode: 200,
                responseTime: 100,
            };

            const databaseQueryError = new DatabaseQueryError(new Error('Original DB Error'));
            mockInsertResponseLog.mockRejectedValue(databaseQueryError);

            await expect(logService.saveResponseLog(responseLog)).rejects.toBe(databaseQueryError);
        });

        it('일반 에러가 발생하면 DatabaseQueryError로 감싸서 throw해야 한다.', async () => {
            const responseLog: ResponseLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
                statusCode: 200,
                responseTime: 100,
            };

            const originalError = new Error('DB Error');
            mockInsertResponseLog.mockRejectedValue(originalError);

            try {
                await logService.saveResponseLog(responseLog);
                fail('에러가 발생해야 합니다.');
            } catch (error) {
                expect(error).toBeInstanceOf(DatabaseQueryError);
                const dbError = error as DatabaseQueryError;
                expect(dbError.message).toBe('데이터베이스 쿼리 중 문제가 발생했습니다.');
                expect(dbError.originalError).toBe(originalError);
            }
        });
    });

    describe('saveErrorLog()는', () => {
        beforeEach(() => {
            logService = new LogService();
        });

        it('errorLog를 올바르게 파일에 저장할 수 있어야 한다.', async () => {
            const errorLog: ErrorLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
                request: {
                    method: 'GET',
                    host: 'example.com',
                    path: '/test',
                    headers: {
                        'user-agent': 'test-agent',
                    },
                },
                error: {
                    message: 'Test error',
                    name: 'TestError',
                },
            };

            (path.join as jest.Mock).mockReturnValue('logs/error.log');

            await logService.saveErrorLog(errorLog);

            expect(path.join).toHaveBeenCalledWith('logs', 'error.log');
            expect(fs.promises.appendFile).toHaveBeenCalledWith(
                'logs/error.log',
                expect.stringContaining('"Test error"'),
            );
        });

        it('쓰는 동안 발생하는 에러를 성공적으로 처리할 수 있어야 한다.', async () => {
            const errorLog: ErrorLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
                request: {
                    method: 'GET',
                    host: 'example.com',
                    path: '/test',
                    headers: {},
                },
                error: {
                    message: 'Test error',
                    name: 'TestError',
                },
            };

            (fs.promises.appendFile as jest.Mock).mockRejectedValue(new Error('Write failed'));
            const consoleSpy = jest.spyOn(console, 'error');

            await logService.saveErrorLog(errorLog);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to write error log:',
                expect.any(Error),
            );
        });

        it('파일 쓰기 권한이 없을 때 에러를 처리할 수 있어야 한다.', async () => {
            const errorLog: ErrorLog = {
                method: 'GET',
                host: 'example.com',
                path: '/test',
                request: {
                    method: 'GET',
                    host: 'example.com',
                    path: '/test',
                    headers: {},
                },
                error: {
                    message: 'Test error',
                    name: 'TestError',
                },
            };

            const permissionError = new Error('EACCES: permission denied');
            (fs.promises.appendFile as jest.Mock).mockRejectedValue(permissionError);

            const consoleSpy = jest.spyOn(console, 'error');

            await logService.saveErrorLog(errorLog);

            expect(consoleSpy).toHaveBeenCalledWith('Failed to write error log:', permissionError);
        });
    });
});
