import { Clickhouse } from '../../clickhouse/clickhouse';
import { Injectable } from '@nestjs/common';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import { HostErrorRateMetric } from './metric/host-error-rate.metric';
import { plainToInstance } from 'class-transformer';

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

        const results = await this.clickhouse.query<HostErrorRateMetric>(query, params);

        return results.map((result) => plainToInstance(HostErrorRateMetric, result));
    }
}
