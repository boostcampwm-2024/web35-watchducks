import { Clickhouse } from '../clickhouse/clickhouse';
import { Injectable } from '@nestjs/common';
import { TimeSeriesQueryBuilder } from '../clickhouse/query-builder/time-series.query-builder';

@Injectable()
export class LogRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findDAUByProject(domain: string, date: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: `SUM(access) as dau` }])
            .from('dau')
            .filter({ domain: domain, date: date })
            .build();

        const [result] = await this.clickhouse.query<{ dau: number }>(query, params);
        return result?.dau ? result.dau : 0;
    }
}
