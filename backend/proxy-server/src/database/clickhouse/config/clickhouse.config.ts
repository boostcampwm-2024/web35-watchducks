import { ClickHouseClientConfigOptions } from '@clickhouse/client';

export const clickhouseConfig: ClickHouseClientConfigOptions = {
    host: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
    username: process.env.CLICKHOUSE_USERNAME || 'default',
    password: process.env.CLICKHOUSE_PASSWORD || '',
    database: process.env.CLICKHOUSE_DATABASE,
};
