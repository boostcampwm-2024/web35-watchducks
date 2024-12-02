import { ClickHouseClientConfigOptions } from '@clickhouse/client';

export const clickhouseConfig: ClickHouseClientConfigOptions = {
    url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USERNAME || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: process.env.CLICKHOUSE_DATABASE,
    clickhouse_settings: {
        async_insert: 1,
        wait_for_async_insert: 0,
    },
};
