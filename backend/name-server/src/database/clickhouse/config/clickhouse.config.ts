import type { ClickHouseClientConfigOptions } from '@clickhouse/client';

export const clickhouseConfig: ClickHouseClientConfigOptions =
    process.env.NODE_ENV === 'development'
        ? {
              url: process.env.DEV_CLICKHOUSE_URL,
              username: process.env.DEV_CLICKHOUSE_USERNAME,
              password: process.env.DEV_CLICKHOUSE_PASSWORD,
              database: process.env.DEV_CLICKHOUSE_DATABASE,
          }
        : {
              url: process.env.CLICKHOUSE_URL || 'http://localhost:8123',
              username: process.env.CLICKHOUSE_USERNAME || 'default',
              password: process.env.CLICKHOUSE_PASSWORD || '',
              database: process.env.CLICKHOUSE_DATABASE,
          };
