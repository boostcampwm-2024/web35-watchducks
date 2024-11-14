import type { LogRepository } from '../../../src/domain/log/log.repository';
import { HttpLogEntity } from '../../../src/domain/log/http-log.entity';

class MockLogRepository implements LogRepository {
    public logs: HttpLogEntity[] = [];

    async insertHttpLog(log: HttpLogEntity): Promise<void> {
        this.logs.push(log);
    }
}

describe('LogRepository는 ', () => {
    let repository: MockLogRepository;

    beforeEach(() => {
        repository = new MockLogRepository();
    });

    it('httpLog 정보를 성공적으로 삽입할 수 있어야 한다.', async () => {
        const log = new HttpLogEntity({
            method: 'GET',
            host: 'api.example.com',
            path: '/users',
            statusCode: 200,
            responseTime: 100,
        });

        await repository.insertHttpLog(log);

        expect(repository.logs).toHaveLength(1);
        expect(repository.logs[0]).toBe(log);
    });
});
