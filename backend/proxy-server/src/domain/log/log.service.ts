import { DatabaseQueryError } from '../../common/error/database-query.error';
import { RequestLogEntity } from './request-log.entity';
import { ResponseLogEntity } from './response-log.entity';
import { LogRepository } from './log.repository';

export class LogService {
    constructor(private readonly logRepository: LogRepository) {}

    public async saveRequestLog(log: RequestLogEntity): Promise<void> {
        try {
            await this.logRepository.insertRequestLog(log);
        } catch (error) {
            if (error instanceof DatabaseQueryError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }

    public async saveResponseLog(log: ResponseLogEntity): Promise<void> {
        try {
            await this.logRepository.insertResponseLog(log);
        } catch (error) {
            if (error instanceof DatabaseQueryError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }
}
