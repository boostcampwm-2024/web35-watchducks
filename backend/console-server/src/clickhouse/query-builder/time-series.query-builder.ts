import { MetricAggregationType, metricExpressions } from '../util/metric-expressions';

export class TimeSeriesQueryBuilder {
    private query: string;
    private params: Record<string, any> = {};

    constructor() {
        this.query = `SELECT`;
    }

    /**
     * @param interval Clickhouse interval format: '1 MINUTE', '5 MINUTE', '1 HOUR'
     */
    interval(interval: string): this {
        this.query += `
      toStartOf${interval}(timestamp) as timestamp`;

        return this;
    }

    metric(metric: string, aggregation: MetricAggregationType): this {
        const expression = metricExpressions[aggregation];

        if (!expression) {
            throw new Error(`Unsupported aggregation: ${aggregation}`);
        }
        this.query += `, ${expression(metric)}`;

        return this;
    }

    from(table: string): this {
        this.query += `
    FROM ${table}`;

        return this;
    }

    timeBetween(start: Date, end: Date) {
        this.query += `
    WHERE timestamp >= {startTime: DateTime64(3)}
    AND timestamp < {endTime: DateTime64(3)}`;

        this.params.startTime = start;
        this.params.endTime = end;

        return this;
    }

    filter(filters: Record<string, any>): this {
        if (filters) {
            Object.entries(filters).forEach(([key, value]) => {
                this.query += ` AND ${key} = {${key}}`;
                this.params[key] = value;
            });
        }

        return this;
    }

    groupBy(group: string[]): this {
        this.query += `
    GROUP BY timestamp`;

        if (group.length > 0) {
            this.query += `, ${group.join(', ')}`;
        }

        this.query += `
    ORDER BY timestamp`;

        return this;
    }

    build() {
        return { query: this.query, params: this.params };
    }
}
