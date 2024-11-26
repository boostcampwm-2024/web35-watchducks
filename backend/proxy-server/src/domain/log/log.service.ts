import type { HttpLogEntity } from './http-log.entity';
import type { LogRepositoryClickhouse } from 'database/query/log.repository.clickhouse';
export class LogService {
    constructor(private readonly logRepository: LogRepositoryClickhouse) {}

    public async saveHttpLog(log: HttpLogEntity): Promise<void> {
            await this.logRepository.insertHttpLog(log);
    }
}
