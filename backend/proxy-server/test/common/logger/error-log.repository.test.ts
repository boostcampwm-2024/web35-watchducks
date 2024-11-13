import { ErrorLogRepository } from '../../../src/common/logger/error-log.repository';
import fs from 'fs';
import path from 'path';

jest.mock('fs', () => ({
    promises: {
        appendFile: jest.fn(),
    },
    existsSync: jest.fn(),
    mkdirSync: jest.fn(),
}));

describe('ErrorLogRepository 테스트', () => {
    let repository: ErrorLogRepository;

    beforeEach(() => {
        jest.clearAllMocks();
        repository = new ErrorLogRepository();
    });

    describe('constructor()는 ', () => {
        it('로그 디렉토리가 없다면, 생성해야 한다.', () => {
            (fs.existsSync as jest.Mock).mockReturnValue(false);

            new ErrorLogRepository();

            expect(fs.existsSync).toHaveBeenCalledWith('logs');
            expect(fs.mkdirSync).toHaveBeenCalledWith('logs');
        });
    });

    describe('saveErrorLog()는 ', () => {
        it('에러 로그를 파일에 저장할 수 있어야 한다.', async () => {
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

            await repository.saveErrorLog(errorLog);

            expect(fs.promises.appendFile).toHaveBeenCalledWith(
                path.join('logs', 'error.log'),
                expect.stringContaining('"method":"GET"'),
            );
        });

        it('에러를 파일에 기록할 수 있어야 한다.', async () => {
            const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
            (fs.promises.appendFile as jest.Mock).mockRejectedValue(new Error('Write failed'));

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
            await repository.saveErrorLog(errorLog);

            expect(consoleSpy).toHaveBeenCalledWith(
                'Failed to write error log:',
                expect.any(Error),
            );
            consoleSpy.mockRestore();
        });
    });
});
