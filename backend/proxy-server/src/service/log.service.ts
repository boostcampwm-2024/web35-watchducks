import * as fs from 'fs';
import * as path from 'path';
import type { RequestLog, ResponseLog, ErrorLog } from '../common/interface/log.interface';
import { LogQuery } from '../database/query/log.query';
import { DatabaseQueryError } from '../error/database-query.error';

export class LogService {
    private readonly logQuery: LogQuery;
    private readonly logDir = 'logs';
    private readonly errorLogFile = 'error.log';

    constructor() {
        this.logQuery = new LogQuery();
        this.initializeLogDirectory();
    }

    private initializeLogDirectory(): void {
        try {
            if (!fs.existsSync(this.logDir)) {
                fs.mkdirSync(this.logDir);
            }
        } catch (error) {
            console.error('Failed to create log directory:', error);
        }
    }

    private async appendToErrorLog(data: string): Promise<void> {
        const filePath = path.join(this.logDir, this.errorLogFile);
        try {
            await fs.promises.appendFile(filePath, data + '\n');
        } catch (error) {
            console.error('Failed to write error log:', error);
        }
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

    public async saveErrorLog(log: ErrorLog): Promise<void> {
        const logEntry = JSON.stringify({
            ...log,
            timestamp: new Date(),
        });
        await this.appendToErrorLog(logEntry);
    }
}
