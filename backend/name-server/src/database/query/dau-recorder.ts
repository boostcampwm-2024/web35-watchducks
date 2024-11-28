import { ClickhouseDatabase } from '../clickhouse/clickhouse-database';

export interface DAURecorderInterface {
    recordAccess(domain: string): Promise<void>;
}

export class DAURecorder implements DAURecorderInterface {
    private clickhouseClient = ClickhouseDatabase.getInstance();

    public async recordAccess(domain: string): Promise<void> {
        const values = [
            { domain: domain.toLowerCase(), date: this.formatDate(new Date()), access: 1 },
        ];
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

    private formatDate(date: Date): string {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        return `${year}-${month}-${day}`;
    }
}
