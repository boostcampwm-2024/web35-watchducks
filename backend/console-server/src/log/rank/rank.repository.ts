import { Clickhouse } from '../../clickhouse/clickhouse';
import { Injectable } from '@nestjs/common';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import { HostErrorRateMetric } from './metric/host-error-rate.metric';
import { HostDauMetric } from './metric/host-dau.metric';

@Injectable()
export class RankRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findSuccessRateOrderByCount() {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'host' }, { name: 'is_error', aggregation: 'rate' }])
            .from('http_log')
            .groupBy(['host'])
            .orderBy(['is_error_rate'])
            .build();

        return await this.clickhouse.query<HostErrorRateMetric>(query, params);
    }

    async findCountOrderByDAU(date: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'domain as host' }, { name: 'SUM(access) as dau' }])
            .from('dau')
            .filter({ date })
            .groupBy(['domain'])
            .orderBy(['dau'], true)
            .build();

        return await this.clickhouse.query<HostDauMetric>(query, params);
    }
}
