import { registerAs } from '@nestjs/config';

export default registerAs('clickhouse', () => ({
    clickhouse: {
        host: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
        username: process.env.CLICKHOUSE_USER ?? 'default',
        database: process.env.CLICKHOUSE_DATABASE ?? 'default',
        password: process.env.CLICKHOUSE_PASSWORD ?? '',
        request_timeout: 30 * 1000, // 30s
    },
}));
