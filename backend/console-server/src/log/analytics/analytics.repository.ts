import { Injectable } from '@nestjs/common';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import { DauMetric } from './metric/dau.metric';

@Injectable()
export class AnalyticsRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findDAUByProject(domain: string, date: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: `SUM(access) as dau` }])
            .from('dau')
            .filter({ domain: domain, date: date })
            .build();

        const [result] = await this.clickhouse.query<DauMetric>(query, params);

        return result?.dau ? result.dau : 0;
    }
}
