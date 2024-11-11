export const clickhouseConfig = {
    url: process.env.CLICKHOUSE_URL || 'http://localhost',
    port: Number(process.env.CLICKHOUSE_PORT) || 8123,
    debug: false,
    basicAuth: process.env.CLICKHOUSE_AUTH
        ? {
              username: process.env.CLICKHOUSE_USERNAME || 'default',
              password: process.env.CLICKHOUSE_PASSWORD || '',
          }
        : null,
    format: 'json',
    config: {
        session_timeout: 60,
        database: process.env.CLICKHOUSE_DATABASE,
    },
};
