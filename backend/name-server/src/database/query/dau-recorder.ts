import { ClickhouseDatabase } from '../clickhouse/clickhouse-database';

export interface DAURecorderInterface {
    recordAccess(domain: string): Promise<void>;
}

export class DAURecorder implements DAURecorderInterface {
    private clickhouseClient = ClickhouseDatabase.getInstance();

    public async recordAccess(domain: string): Promise<void> {
        const date = new Date().toISOString().slice(0, 10);
        const values = [{ domain, date, access: 1 }];
        try {
            await this.clickhouseClient.insert({
                table: 'dau',
                values,
                format: 'JSONEachRow',
            });
        } catch (error) {
            console.error('ClickHouse Error:', error);
        }
    }
}
