import type { MetricAggregationType } from '../util/metric-expressions';
import { metricExpressions } from '../util/metric-expressions';
import { mapFilterCondition } from '../util/map-filter-condition';

interface metric {
    name: string;
    aggregation?: MetricAggregationType;
}

export class TimeSeriesQueryBuilder {
    private query: string;
    private params: Record<string, any> = {};
    private limitValue?: number;

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

    metrics(metrics: metric[]): this {
        const metricsQuery = metrics.map((metric) => {
            if (metric.aggregation) {
                const expression = metricExpressions[metric.aggregation];

                if (!expression) {
                    throw new Error(`Unsupported aggregation: ${metric.aggregation}`);
                }
                return `${expression(metric.name)}`;
            }
            return metric.name;
        });

        this.query += ` ${metricsQuery.join(', ')}`;

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
            const conditions = Object.entries(filters).map(([key, value]) => {
                const { condition, param } = mapFilterCondition(key, value);
                this.params[key] = param;
                return condition;
            });

            if (this.query.includes('WHERE')) {
                this.query += ` AND ${conditions.join(' AND ')}`;
            } else {
                this.query += ` WHERE ${conditions.join(' AND ')}`;
            }
        }

        return this;
    }

    groupBy(group: string[]): this {
        if (group.length > 0) {
            this.query += ` GROUP BY ${group.join(', ')}`;
        }

        return this;
    }

    orderBy(fields: string[], desc: boolean) {
        this.query += ` ORDER BY ${fields.join(', ')}`;

        if (desc) {
            this.query += ` DESC`;
        }

        return this;
    }

    limit(value: number): this {
        this.limitValue = value;
        return this;
    }

    build() {
        if (this.limitValue) {
            this.query += ` LIMIT ${this.limitValue}`;
        }

        console.log(this.query);

        return { query: this.query, params: this.params };
    }
}
