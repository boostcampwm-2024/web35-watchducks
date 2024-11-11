import type { ClickHouse } from 'clickhouse';
import type { RequestLog, ResponseLog, ErrorLog } from '../../common/interface/log.interface';
import { ClickhouseDatabase } from '../clickhouse/clickhouse-database';
import { DatabaseQueryError } from '../../error/database-query.error';

export class LogQuery {
    private readonly clickhouse: ClickHouse;

    constructor() {
        this.clickhouse = ClickhouseDatabase.getInstance();
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

    public async insertRequestLog(log: RequestLog): Promise<void> {
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

    public async insertResponseLog(log: ResponseLog): Promise<void> {
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

            await this.clickhouse.query(query).toPromise();
        } catch (error) {
            console.error('ClickHouse Error:', error);
            throw new DatabaseQueryError(error as Error);
        }
    }
}
