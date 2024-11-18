type MetricFunction = (metric: string) => string;

export const metricExpressions: Record<string, MetricFunction> = {
    avg: (metric: string) => `avg(${metric}) as avg_${metric}`,
    count: () => `count() as count`,
    sum: (metric: string) => `sum(${metric}) as sum_${metric}`,
    min: (metric: string) => `min(${metric}) as min_${metric}`,
    max: (metric: string) => `max(${metric}) as max_${metric}`,
    p95: (metric: string) => `quantile(0.95)(${metric}) as p95_${metric}`,
    p99: (metric: string) => `quantile(0.99)(${metric}) as p99_${metric}`,
    rate: (metric: string) => `(sum(${metric}) / count(*)) * 100 as ${metric}_rate`,
};

export type MetricAggregationType = keyof typeof metricExpressions;
