type MetricFunction = (metric: string) => string;

export const metricExpressions: Record<string, MetricFunction> = {
    avg: (metric: string) => `avg(${metric}) as ${metric}`,
    count: () => `count() as count`,
    sum: (metric: string) => `sum(${metric}) as ${metric}`,
    min: (metric: string) => `min(${metric}) as ${metric}`,
    max: (metric: string) => `max(${metric}) as ${metric}`,
    p95: (metric: string) => `quantile(0.95)(${metric}) as ${metric}`,
    p99: (metric: string) => `quantile(0.99)(${metric}) as ${metric}`,
};

export type MetricAggregationType = keyof typeof metricExpressions;
