export const metricExpressions: Record<string, MetricFunction> = {
    avg: (metric: string) => `avg(${metric}) as avg_${metric}`,
    count: () => `toUInt32(count()) as count`,
    sum: (metric: string) => `sum(${metric}) as sum_${metric}`,
    min: (metric: string) => `min(${metric}) as min_${metric}`,
    max: (metric: string) => `max(${metric}) as max_${metric}`,
    rate: (metric: string) => `(sum(${metric}) / count(*)) * 100 as ${metric}_rate`,
};

export type MetricAggregationType = keyof typeof metricExpressions;

export type MetricFunction = (metric: string) => string;
