import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import { AvgElapsedTimeMetric } from './metric/avg-elapsed-time.metric';
import { plainToInstance } from 'class-transformer';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { HostAvgElapsedTimeMetric } from './metric/host-avg-elapsed-time.metric';
import { PathElapsedTimeMetric } from './metric/path-elapsed-time.metric';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ElapsedTimeRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findAvgElapsedTime() {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'elapsed_time', aggregation: 'avg' }])
            .from('http_log')
            .build();

        const [result] = await this.clickhouse.query<AvgElapsedTimeMetric>(query, params);

        return plainToInstance(AvgElapsedTimeMetric, result);
    }

    async findAvgElapsedTimeLimit() {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'elapsed_time', aggregation: 'avg' }, { name: 'host' }])
            .from('http_log')
            .groupBy(['host'])
            .orderBy(['avg_elapsed_time'], false)
            .limit(5)
            .build();
        const results = await this.clickhouse.query<HostAvgElapsedTimeMetric>(query, params);
        return results.map((result) => plainToInstance(HostAvgElapsedTimeMetric, result));
    }

    async findFastestPathsByDomain(domain: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([
                { name: 'toUInt32(avg(elapsed_time)) as avg_elapsed_time' },
                { name: 'path' },
                { name: 'if(status_code >= 200 AND status_code < 300, 1, 0) AS is_valid' },
            ])
            .from('http_log')
            .filter({ host: domain, is_valid: 1 })
            .groupBy(['path', 'is_valid'])
            .orderBy(['avg_elapsed_time'], false)
            .limit(3)
            .build();

        const results = await this.clickhouse.query<PathElapsedTimeMetric>(query, params);

        return results.map((result) => plainToInstance(PathElapsedTimeMetric, result));
    }

    async findSlowestPathsByDomain(domain: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([
                { name: 'toUInt32(avg(elapsed_time)) as avg_elapsed_time' },
                { name: 'path' },
            ])
            .from('http_log')
            .filter({ host: domain })
            .groupBy(['path'])
            .orderBy(['avg_elapsed_time'], true)
            .limit(3)
            .build();

        const results = await this.clickhouse.query<PathElapsedTimeMetric>(query, params);

        return results.map((result) => plainToInstance(PathElapsedTimeMetric, result));
    }
}
