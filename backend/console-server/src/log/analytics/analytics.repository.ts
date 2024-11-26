import { Injectable } from '@nestjs/common';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import { DauMetric } from './metric/dau.metric';

@Injectable()
export class AnalyticsRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findDAUsByProject(domain: string, start: Date, end: Date) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: `date` }, { name: `SUM(access) as dau` }])
            .from('dau')
            .filter({ domain })
            .timeBetween(start, end, 'date')
            .groupBy(['date'])
            .orderBy(['date'])
            .build();

        return await this.clickhouse.query<DauMetric>(query, params);
    }
}
