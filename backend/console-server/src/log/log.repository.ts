import { Clickhouse } from '../clickhouse/clickhouse';
import { Injectable } from '@nestjs/common';
import { TimeSeriesQueryBuilder } from '../clickhouse/query-builder/time-series.query-builder';

@Injectable()
export class LogRepository {
    constructor(private readonly clickhouse: Clickhouse) {}

    async findHttpLog() {
        const sql = `SELECT toDate(timestamp) as date,
                            avg(elapsed_time) as avg_elapsed_time,
                            count()           as request_count
                     FROM http_log
                     WHERE timestamp >= toStartOfDay(now() - INTERVAL 7 DAY)
                       AND timestamp < toStartOfDay(now())
                     GROUP BY date
                     ORDER BY date;`;
        return await this.clickhouse.query(sql);
    }

    async findAvgElapsedTime() {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'elapsed_time', aggregation: 'avg' }])
            .from('http_log')
            .build();

        const result = await this.clickhouse.query(query, params);

        return result[0];
    }

    async findCountByHost() {
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
            .build();

        return await this.clickhouse.query(query, params);
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

        const result = await this.clickhouse.query(query);
        return {
            success_rate: 100 - (result as Array<{ is_error_rate: number }>)[0].is_error_rate,
        };
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

        const result = await this.clickhouse.query(mainQueryBuilder.query, subQueryBuilder.params);
        return {
            success_rate: 100 - (result as Array<{ is_error_rate: number }>)[0].is_error_rate,
        };
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

        const result = await this.clickhouse.query(query, params);
        return [{ count: ((result as unknown[])[0] as { count: number }).count }];
    }

    async getPathSpeedRankByProject(domain: string) {
        const fastestQueryBuilder = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'elapsed_time', aggregation: 'avg' }, { name: 'path' }])
            .from('http_log')
            .filter({ host: domain })
            .groupBy(['path'])
            .orderBy(['avg_elapsed_time'], false)
            .limit(3)
            .build();

        const slowestQueryBuilder = new TimeSeriesQueryBuilder()
            .metrics([{ name: 'elapsed_time', aggregation: 'avg' }, { name: 'path' }])
            .from('http_log')
            .filter({ host: domain })
            .groupBy(['path'])
            .orderBy(['avg_elapsed_time'], true)
            .limit(3)
            .build();

        const [fastestPaths, slowestPaths] = await Promise.all([
            this.clickhouse.query(fastestQueryBuilder.query, fastestQueryBuilder.params),
            this.clickhouse.query(slowestQueryBuilder.query, slowestQueryBuilder.params),
        ]);

        return {
            fastestPaths,
            slowestPaths,
        };
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

        return await this.clickhouse.query(query, params);
    }

    async getDAUByProject(domain: string, date: string) {
        const { query, params } = new TimeSeriesQueryBuilder()
            .metrics([{ name: `SUM(access) as dau` }])
            .from('dau')
            .filter({ domain: domain, date: date })
            .build();
        const result = await this.clickhouse.query<{ dau: number }>(query, params);
        if (result.length > 0 && result[0].dau !== null) {
            return result[0].dau;
        } else {
            return 0;
        }
    }
}
