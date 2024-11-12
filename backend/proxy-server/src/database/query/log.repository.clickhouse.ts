import type { ClickHouse } from 'clickhouse';
import { ClickhouseDatabase } from '../clickhouse/clickhouse-database';
import { DatabaseQueryError } from '../../common/error/database-query.error';
import { LogRepository } from '../../domain/log/log.repository';
import { RequestLogEntity } from '../../domain/log/request-log.entity';
import { ResponseLogEntity } from '../../domain/log/response-log.entity';

export class LogRepositoryClickhouse implements LogRepository {
    private readonly clickhouse: ClickHouse;

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
            const query = `\nINSERT INTO request_log FORMAT JSONEachRow ${JSON.stringify(values)}`;

            await this.clickhouse.insert(query).toPromise();
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
            const query = `\nINSERT INTO response_log FORMAT JSONEachRow ${this.formatValues(values)}`;

            console.log('쿠어리 ~~~~~~~~~~~~~~~~~~ : ', query); // TODO : 삭제

            await this.clickhouse.query(query).toPromise();
        } catch (error) {
            console.error('ClickHouse Error:', error);
            throw new DatabaseQueryError(error as Error);
        }
    }

    private formatValues(values: any): string {
        return JSON.stringify(values[0]);
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
