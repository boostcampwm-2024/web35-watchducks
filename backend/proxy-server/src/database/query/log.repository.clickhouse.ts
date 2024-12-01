import { ClickhouseDatabase } from '../clickhouse/clickhouse-database';
import { DatabaseQueryError } from 'common/error/database-query.error';
import { LogRepository } from 'domain/port/output/log.repository';
import { HttpLogEntity } from 'domain/entity/http-log.entity';
import { ClickHouseClient } from '@clickhouse/client';
import { formatDateTime } from 'common/utils/date.util';
import { LogBufferConfig } from 'domain/config/log-buffer.config';

type HttpLogRecord = {
    method: string;
    path: string;
    host: string;
    status_code: number;
    elapsed_time: number;
    timestamp: string;
    user_ip: string;
};

export class LogRepositoryClickhouse implements LogRepository {
    private readonly clickhouse: ClickHouseClient;
    private readonly config: LogBufferConfig;
    private logBuffer: HttpLogRecord[] = [];
    private flushTimer: NodeJS.Timeout | null = null;
    private isProcessing: boolean = false;

    constructor(config: LogBufferConfig) {
        this.clickhouse = ClickhouseDatabase.getInstance();
        this.config = config;
        this.startFlushTimer();
    }

    private startFlushTimer(): void {
        if (this.flushTimer) {
            clearInterval(this.flushTimer);
        }

        this.flushTimer = setInterval(async () => {
            if (this.logBuffer.length > 0 && !this.isProcessing) {
                await this.flush();
            }
        }, this.config.flushIntervalSecond * 1000);
    }

    private async flush(): Promise<void> {
        if (this.isProcessing || this.logBuffer.length === 0) {
            return;
        }
        let batchToFlush = [...this.logBuffer];

        this.logBuffer = [];
        try {
            this.isProcessing = true;

            await this.clickhouse.insert({
                table: 'http_log',
                values: batchToFlush,
                format: 'JSONEachRow',
            });
        } catch (error) {
            this.logBuffer = [...this.logBuffer, ...batchToFlush];
            throw new DatabaseQueryError(error as Error);
        } finally {
            this.isProcessing = false;
        }
    }

    public async insertHttpLog(log: HttpLogEntity): Promise<void> {
        const httpLogRecord: HttpLogRecord = {
            method: log.method,
            path: log.path || '',
            host: log.host,
            status_code: log.statusCode,
            elapsed_time: Math.round(log.responseTime),
            timestamp: formatDateTime(new Date()),
            user_ip: log.userIp,
        };

        this.logBuffer.push(httpLogRecord);

        if (this.logBuffer.length >= this.config.maxSize) {
            this.flush();
        }
    }
}
