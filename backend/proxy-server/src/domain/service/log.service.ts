import type { HttpLogEntity } from 'domain/entity/http-log.entity';
import type { LogRepository } from 'domain/port/output/log.repository';
import type { LogUseCase } from 'domain/port/input/log.use-case';

export class LogService implements LogUseCase {
    constructor(private readonly logRepository: LogRepository) {}

    async saveHttpLog(log: HttpLogEntity): Promise<void> {
        return this.logRepository.insertHttpLog(log);
    }
}
