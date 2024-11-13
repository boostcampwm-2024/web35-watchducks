import { LogService } from '../../../src/domain/log/log.service';
import type { LogRepository } from '../../../src/domain/log/log.repository';
import { HttpLogEntity } from '../../../src/domain/log/http-log.entity';
import { DatabaseQueryError } from '../../../src/common/error/database-query.error';

describe('LogService 테스트', () => {
    let logService: LogService;
    let mockLogRepository: jest.Mocked<LogRepository>;

    beforeEach(() => {
        mockLogRepository = {
            insertHttpLog: jest.fn(),
        };
        logService = new LogService(mockLogRepository);
    });

    const createTestLog = () =>
        new HttpLogEntity({
            method: 'GET',
            host: 'api.example.com',
            path: '/users',
            statusCode: 200,
            responseTime: 100,
        });

    describe('saveHttpLog()는 ', () => {
        it('httpLog를 성공적으로 저장해야 한다.', async () => {
            const log = createTestLog();
            mockLogRepository.insertHttpLog.mockResolvedValue(undefined);

            await logService.saveHttpLog(log);

            expect(mockLogRepository.insertHttpLog).toHaveBeenCalledWith(log);
        });

        it('DatabaseQueryError를 던져야 한다.', async () => {
            const log = createTestLog();
            const error = new DatabaseQueryError(new Error('DB connection failed'));
            mockLogRepository.insertHttpLog.mockRejectedValue(error);

            await expect(logService.saveHttpLog(log)).rejects.toThrow(DatabaseQueryError);
            expect(mockLogRepository.insertHttpLog).toHaveBeenCalledWith(log);
        });

        it('일반 오류를 DatabaseQueryError로 감싸서 던져야 한다.', async () => {
            const log = createTestLog();
            const error = new Error('Unknown error');
            mockLogRepository.insertHttpLog.mockRejectedValue(error);

            await expect(logService.saveHttpLog(log)).rejects.toThrow(DatabaseQueryError);
            expect(mockLogRepository.insertHttpLog).toHaveBeenCalledWith(log);
        });
    });
});
