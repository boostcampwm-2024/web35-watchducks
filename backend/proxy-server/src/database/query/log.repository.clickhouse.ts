import { ClickhouseDatabase } from '../clickhouse/clickhouse-database';
import { DatabaseQueryError } from '../../common/error/database-query.error';
import { LogRepository } from '../../domain/log/log.repository';
import { RequestLogEntity } from '../../domain/log/request-log.entity';
import { ResponseLogEntity } from '../../domain/log/response-log.entity';
import { ClickHouseClient } from '@clickhouse/client';

export class LogRepositoryClickhouse implements LogRepository {
    private readonly clickhouse: ClickHouseClient;

    constructor() {
        this.clickhouse = ClickhouseDatabase.getInstance();
    }

    public async insertRequestLog(log: RequestLogEntity): Promise<void> {
        const values = [
            {
                method: log.method,
                path: log.path || '',
                host: log.host,
                timestamp: this.formatDate(new Date()),
            },
        ];

        try {
            await this.clickhouse.insert({
                table: 'request_log',
                values: values,
                format: 'JSONEachRow',
            });
        } catch (error) {
            console.error('ClickHouse Error:', error);
            throw new DatabaseQueryError(error as Error);
        }
    }

    public async insertResponseLog(log: ResponseLogEntity): Promise<void> {
        const values = [
            {
                method: log.method,
                path: log.path || '',
                host: log.host,
                status_code: log.statusCode,
                elapsed_time: Math.round(log.responseTime),
                timestamp: this.formatDate(new Date()),
            },
        ];

        try {
            await this.clickhouse.insert({
                table: 'response_log',
                values: values,
                format: 'JSONEachRow',
            });
        } catch (error) {
            console.error('ClickHouse Error:', error);
            throw new DatabaseQueryError(error as Error);
        }
    }

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
