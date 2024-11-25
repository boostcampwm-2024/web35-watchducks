import { ClickhouseDatabase } from '../clickhouse/clickhouse-database';
import { DatabaseQueryError } from '../../common/error/database-query.error';
import { LogRepository } from '../../domain/log/log.repository';
import { HttpLogEntity } from '../../domain/log/http-log.entity';
import { ClickHouseClient } from '@clickhouse/client';

export class LogRepositoryClickhouse implements LogRepository {
    private readonly clickhouse: ClickHouseClient;

    constructor() {
        this.clickhouse = ClickhouseDatabase.getInstance();
    }

    public async insertHttpLog(log: HttpLogEntity): Promise<void> {
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
                table: 'http_log',
                values: values,
                format: 'JSONEachRow',
            });
        } catch (error) {
            console.error('ClickHouse Error:', error);
            throw new DatabaseQueryError(error as Error);
        }
    }

    private formatDate(date: Date): string {
        const localTime = new Date(date.getTime() + 9 * 60 * 60 * 1000);

        const year = localTime.getFullYear();
        const month = String(localTime.getMonth() + 1).padStart(2, '0');
        const day = String(localTime.getDate()).padStart(2, '0');
        const hours = String(localTime.getHours()).padStart(2, '0');
        const minutes = String(localTime.getMinutes()).padStart(2, '0');
        const seconds = String(localTime.getSeconds()).padStart(2, '0');

        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}
