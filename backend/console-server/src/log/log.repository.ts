import { Clickhouse } from '../clickhouse/clickhouse';
import { Injectable } from '@nestjs/common';
import { TimeSeriesQueryBuilder } from '../clickhouse/query-builder/time-series.query-builder';
import { getDateRange } from '../clickhouse/util/date-range';

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

    async analyzeElapsedTime() {
        const { start, end } = getDateRange();
        const { query, params } = new TimeSeriesQueryBuilder()
            .interval('Day')
            .metric('elapsed_time', 'avg')
            .metric('*', 'count')
            .from('http_log')
            .timeBetween(start, end)
            .groupBy(['timestamp'])
            .build();

        return await this.clickhouse.query(query, params);
    }
}
