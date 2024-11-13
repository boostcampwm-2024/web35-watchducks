import { ClickHouse } from 'clickhouse';
import { clickhouseConfig } from './config/clickhouse.config';

export class ClickhouseDatabase {
    private static instance: ClickHouse;

    public static getInstance(): ClickHouse {
        if (!ClickhouseDatabase.instance) {
            ClickhouseDatabase.instance = new ClickHouse(clickhouseConfig);
        }
        return ClickhouseDatabase.instance;
    }
}
