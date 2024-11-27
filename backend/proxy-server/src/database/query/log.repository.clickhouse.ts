import { ClickhouseDatabase } from '../clickhouse/clickhouse-database';
import { DatabaseQueryError } from '../../common/error/database-query.error';
import { LogRepository } from '../../domain/log/log.repository';
import { HttpLogEntity } from '../../domain/log/http-log.entity';
import { ClickHouseClient } from '@clickhouse/client';
import { formatDateTime } from '../../common/utils/date.util';

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
                timestamp: formatDateTime(new Date()),
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
}
