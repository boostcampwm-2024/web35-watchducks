import { TrafficChartMetric } from './metric/traffic-chart.metric';
import { plainToInstance } from 'class-transformer';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { TimeSeriesQueryBuilder } from '../../clickhouse/query-builder/time-series.query-builder';
import { TrafficRankMetric } from './metric/traffic-rank.metric';
import { TrafficRankTop5Metric } from './metric/traffic-rank-top5.metric';
import { TrafficCountMetric } from './metric/traffic-count.metric';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TrafficRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

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

    async findTrafficForTimeRange(start: Date, end: Date) {
        const queryBuilder = new TimeSeriesQueryBuilder()
            .metrics([{ name: '*', aggregation: 'count' }])
            .from('http_log')
            .timeBetween(start, end)
            .build();

        return this.clickhouse.query<{ count: number }>(queryBuilder.query, queryBuilder.params);
    }

    async findTrafficByProject(domain: string, timeUnit: string) {
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
    async findTrafficTop5Chart() {
        const now = new Date();
        const today = new Date(now.setHours(0, 0, 0, 0));
        const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);

        const query = `WITH top_hosts AS (
            SELECT host
            FROM http_log
            WHERE timestamp >= {startTime: DateTime64(3)}
              AND timestamp < {endTime: DateTime64(3)}
            GROUP BY host
            ORDER BY count() DESC
            LIMIT 5
        )
                       SELECT
                           host,
                           groupArray(
                                   (
                                    toDateTime64(toStartOfInterval(timestamp, INTERVAL 1 MINUTE), 0),
                                    requests_count
                                       )
                           ) as traffic
                       FROM (
                                SELECT
                                    host,
                                    toDateTime64(toStartOfInterval(timestamp, INTERVAL 1 MINUTE), 0) as timestamp,
                                    count() as requests_count
                                FROM http_log
                                WHERE timestamp >= {startTime: DateTime64(3)}
                                  AND timestamp < {endTime: DateTime64(3)}
                                  AND host IN (SELECT host FROM top_hosts)
                                GROUP BY
                                    host,
                                    timestamp
                                ORDER BY
                                    timestamp
                                )
                       GROUP BY host;`;
        const params = { startTime: yesterday, endTime: today };
        const results = await this.clickhouse.query<TrafficChartMetric>(query, params);

        return results.map((result) => {
            return plainToInstance(TrafficChartMetric, result);
        });
    }
}
