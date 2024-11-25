import { DatabaseQueryError } from '../../common/error/database-query.error';
import type { HttpLogEntity } from './http-log.entity';
import type { LogRepositoryClickhouse } from 'database/query/log.repository.clickhouse';
export class LogService {
    constructor(private readonly logRepository: LogRepositoryClickhouse) {}

    public async saveHttpLog(log: HttpLogEntity): Promise<void> {
        try {
            await this.logRepository.insertHttpLog(log);
        } catch (error) {
            if (error instanceof DatabaseQueryError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }
}
