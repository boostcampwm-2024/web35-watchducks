import { createClient, ClickHouseClient } from '@clickhouse/client';
import { clickhouseConfig } from './config/clickhouse.config';

export class ClickhouseDatabase {
    private static instance: ClickHouseClient;

    public static getInstance(): ClickHouseClient {
        if (!ClickhouseDatabase.instance) {
            ClickhouseDatabase.instance = createClient(clickhouseConfig);
        }
        return ClickhouseDatabase.instance;
    }
}
