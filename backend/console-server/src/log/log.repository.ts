import { Clickhouse } from '../clickhouse/clickhouse';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LogRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findHttpLog() {
        const sql = `
        SELECT * FROM http_log LIMIT 50`;

        return await this.clickhouse.query(sql);
    }
}
