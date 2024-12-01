import type { HttpLogEntity } from '../vo/http-log.entity';
import type { LogRepository } from 'domain/port/output/log.repository';
import type { LogUseCase } from 'domain/port/input/log.use-case';

export class LogService implements LogUseCase {
    constructor(private readonly logRepository: LogRepository) {}

    async saveHttpLog(log: HttpLogEntity): Promise<void> {
        this.logRepository.insertHttpLog(log);
    }
}
