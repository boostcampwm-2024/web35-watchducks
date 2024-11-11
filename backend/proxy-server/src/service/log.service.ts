import type { RequestLog, ResponseLog } from '../common/interface/log.interface';
import { LogQuery } from '../database/query/log.query';
import { DatabaseQueryError } from '../error/database-query.error';

export class LogService {
    private readonly logQuery: LogQuery;

    constructor() {
        this.logQuery = new LogQuery();
    }

    public async saveRequestLog(log: RequestLog): Promise<void> {
        try {
            await this.logQuery.insertRequestLog(log);
        } catch (error) {
            if (error instanceof DatabaseQueryError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }

    public async saveResponseLog(log: ResponseLog): Promise<void> {
        try {
            await this.logQuery.insertResponseLog(log);
        } catch (error) {
            if (error instanceof DatabaseQueryError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }
}
