export const TIME_RANGE = {
    DAY: '24hours',
    WEEK: '1week',
    MONTH: '1month',
} as const;

export const CLICKHOUSE_TIME_UNIT = {
    ONE_MINUTE: 'Minute',
    FIFTEEN_MINUTES: 'FifteenMinutes',
    ONE_HOUR: 'Hour',
};

export const TIME_RANGE_UNIT_MAP = {
    [TIME_RANGE.DAY]: CLICKHOUSE_TIME_UNIT.ONE_MINUTE,
    [TIME_RANGE.WEEK]: CLICKHOUSE_TIME_UNIT.FIFTEEN_MINUTES,
    [TIME_RANGE.MONTH]: CLICKHOUSE_TIME_UNIT.ONE_HOUR,
} as const;

export type TimeRange = keyof typeof TIME_RANGE_UNIT_MAP;
export type TimeUnit = (typeof TIME_RANGE_UNIT_MAP)[TimeRange];
