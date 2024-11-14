import path from 'path';
import fs from 'fs';
import type { ErrorLog } from './logger.interface';

export class ErrorLogRepository {
    private readonly logDir = 'logs';
    private readonly errorLogFile = 'error.log';

    constructor() {
        this.initializeLogDirectory();
    }

    public async saveErrorLog(log: ErrorLog): Promise<void> {
        const logEntry = JSON.stringify({
            ...log,
            timestamp: new Date(),
        });
        await this.appendToErrorLog(logEntry);
    }

    private async appendToErrorLog(data: string): Promise<void> {
        const filePath = path.join(this.logDir, this.errorLogFile);
        try {
            await fs.promises.appendFile(filePath, data + '\n');
        } catch (error) {
            console.error('Failed to write error log:', error);
        }
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
}
