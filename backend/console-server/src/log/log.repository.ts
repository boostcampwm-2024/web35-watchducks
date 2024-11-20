import { Clickhouse } from '../clickhouse/clickhouse';
import { Injectable } from '@nestjs/common';
import { TimeSeriesQueryBuilder } from '../clickhouse/query-builder/time-series.query-builder';
import { TrafficRankMetric } from './metric/traffic-rank.metric';
import { AvgElapsedTimeMetric } from './metric/avg-elapsed-time.metric';
import { plainToInstance } from 'class-transformer';
import { TrafficRankTop5Metric } from './metric/traffic-rank-top5.metric';
import { TrafficCountMetric } from './metric/traffic-count.metric';
import { ErrorRateMetric } from './metric/error-rate.metric';
import { SuccessRateMetric } from './metric/success-rate.metric';
import { ElapsedTimeByPathMetric } from './metric/elapsed-time-by-path.metric';

@Injectable()
export class LogRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findAvgElapsedTime() {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'elapsed_time', aggregation: 'avg' }])
            .from('http_log')
            .build();

        const [result] = await this.clickhouse.query<AvgElapsedTimeMetric>(query, params);

        return plainToInstance(AvgElapsedTimeMetric, result);
    }

    async findTop5CountByHost() {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([
                {
                    name: 'host',
                },
                {
                    name: '*',
                    aggregation: 'count',
                },
            ])
            .from('http_log')
            .groupBy(['host'])
            .orderBy(['count'], true)
            .limit(5)
            .build();

        const results = await this.clickhouse.query<TrafficRankMetric>(query, params);

        return plainToInstance(
            TrafficRankTop5Metric,
            results.map((result) => plainToInstance(TrafficRankMetric, result)),
        );
    }

    async findResponseSuccessRate() {
        const { query } = new TimeSeriesQueryBuilder()
            .metrics([
                {
                    name: 'is_error',
                    aggregation: 'rate',
                },
            ])
            .from('http_log')
            .build();

        const [result] = await this.clickhouse.query<ErrorRateMetric>(query);

        return plainToInstance(SuccessRateMetric, {
            success_rate: 100 - result.is_error_rate,
        });
    }

    async findResponseSuccessRateByProject(domain: string) {
        const subQueryBuilder = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'is_error' }, { name: 'timestamp' }])
            .from('http_log')
            .filter({ host: domain })
            .orderBy(['timestamp'], true)
            .limit(1000)
            .build();

        const mainQueryBuilder = new TimeSeriesQueryBuilder()
            .metrics([
                {
                    name: 'is_error',
                    aggregation: 'rate',
                },
            ])
            .from(`(${subQueryBuilder.query}) as subquery`)
            .build();

        const [result] = await this.clickhouse.query<ErrorRateMetric>(
            mainQueryBuilder.query,
            subQueryBuilder.params,
        );

        return plainToInstance(SuccessRateMetric, {
            success_rate: 100 - result.is_error_rate,
        });
    }

    async findTrafficByGeneration() {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([
                {
                    name: '*',
                    aggregation: 'count',
                },
            ])
            .from('http_log')
            .build();

        const [result] = await this.clickhouse.query<TrafficCountMetric>(query, params);

        return plainToInstance(TrafficCountMetric, result);
    }

    async getFastestPathsByDomain(domain: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'elapsed_time', aggregation: 'avg' }, { name: 'path' }])
            .from('http_log')
            .filter({ host: domain })
            .groupBy(['path'])
            .orderBy(['avg_elapsed_time'], false)
            .limit(3)
            .build();

        const results = await this.clickhouse.query<ElapsedTimeByPathMetric>(query, params);

        return results.map((result) => plainToInstance(ElapsedTimeByPathMetric, result));
    }

    async getSlowestPathsByDomain(domain: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'elapsed_time', aggregation: 'avg' }, { name: 'path' }])
            .from('http_log')
            .filter({ host: domain })
            .groupBy(['path'])
            .orderBy(['avg_elapsed_time'], true)
            .limit(3)
            .build();

        const results = await this.clickhouse.query<ElapsedTimeByPathMetric>(query, params);

        return results.map((result) => plainToInstance(ElapsedTimeByPathMetric, result));
    }

    async getTrafficByProject(domain: string, timeUnit: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([
                { name: '*', aggregation: 'count' },
                { name: `toStartOf${timeUnit}(timestamp) as timestamp` },
            ])
            .from('http_log')
            .filter({ host: domain })
            .groupBy(['timestamp'])
            .orderBy(['timestamp'], false)
            .build();

        const results = await this.clickhouse.query<TrafficCountMetric>(query, params);

        return results.map((result) => plainToInstance(TrafficCountMetric, result));
    }

    async getDAUByProject(domain: string, date: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: `SUM(access) as dau` }])
            .from('dau')
            .filter({ domain: domain, date: date })
            .build();

        const [result] = await this.clickhouse.query<{ dau: number }>(query, params);

        return result?.dau ? result.dau : 0;
    }
}
