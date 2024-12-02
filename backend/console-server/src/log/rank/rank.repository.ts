import { Clickhouse } from '../../clickhouse/clickhouse';
import { Injectable } from '@nestjs/common';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import { HostErrorRateMetric } from './metric/host-error-rate.metric';
import { HostElapsedTimeMetric } from './metric/host-elapsed-time.metric';
import { HostDauMetric } from './metric/host-dau.metric';
import { HostCountMetric } from './metric/host-count.metric';

@Injectable()
export class RankRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findSuccessRateOrderByCount(date: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([
                { name: 'host' },
                { name: 'is_error', aggregation: 'rate' },
                { name: 'toDate(timestamp) as timestamp' },
            ])
            .from('http_log')
            .filter({ timestamp: date })
            .groupBy(['host', 'timestamp'])
            .orderBy(['is_error_rate'])
            .build();

        return await this.clickhouse.query<HostErrorRateMetric>(query, params);
    }

    async findHostOrderByElapsedTimeSince(date: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([
                { name: 'host' },
                { name: 'toUInt32(avg(elapsed_time)) as avg_elapsed_time' },
                { name: 'toDate(timestamp) as timestamp' },
            ])
            .from('http_log')
            .filter({ timestamp: date })
            .groupBy(['host', 'timestamp'])
            .orderBy(['avg_elapsed_time'])
            .build();
        return await this.clickhouse.query<HostElapsedTimeMetric>(query, params);
    }

    async findCountOrderByDAU(date: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([
                { name: 'host' },
                { name: 'count(DISTINCT user_ip) as dau' },
                { name: 'toDate(timestamp) as timestamp' },
            ])
            .from('http_log')
            .filter({ timestamp: date })
            .groupBy(['host', 'timestamp'])
            .orderBy(['dau'], true)
            .build();

        return await this.clickhouse.query<HostDauMetric>(query, params);
    }

    async findCountOrderByCount() {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'host' }, { name: '*', aggregation: 'count' }])
            .from('http_log')
            .groupBy(['host'])
            .orderBy(['count'], true)
            .build();

        return await this.clickhouse.query<HostCountMetric>(query, params);
    }
}
