import { LogService } from './log.service';
import { HttpLogEntity } from '../entity/http-log.entity';
import { DatabaseQueryError } from 'common/error/database-query.error';
import { LogRepositoryClickhouse } from 'database/query/log.repository.clickhouse';

describe('LogService 테스트', () => {
    let logService: LogService;
    let mockLogRepository: jest.Mocked<LogRepositoryClickhouse>;

    beforeEach(() => {
        class MockLogRepository extends LogRepositoryClickhouse {
            insertHttpLog = jest.fn().mockResolvedValue(undefined);
        }

        mockLogRepository = new MockLogRepository();
        logService = new LogService(mockLogRepository);
    });

    const createTestLog = () =>
        new HttpLogEntity({
            method: 'GET',
            host: 'api.example.com',
            path: '/users',
            statusCode: 200,
            responseTime: 100,
            userIp: '127.0.0.1',
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

            expect(logService.saveHttpLog(log)).rejects.toThrow(DatabaseQueryError);
            expect(mockLogRepository.insertHttpLog).toHaveBeenCalledWith(log);
        });
    });
});
