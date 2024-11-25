export const TIME_RANGE = {
    DAY: '24hours',
    WEEK: '1week',
    MONTH: '1month',
} as const;

export const TIME_UNIT = {
    ONE_MINUTE: '1 minute',
    TWENTY_MINUTES: '20 minute',
    ONE_HOUR: '1 hour',
};

export const TIME_RANGE_UNIT_MAP = {
    [TIME_RANGE.DAY]: TIME_UNIT.ONE_MINUTE,
    [TIME_RANGE.WEEK]: TIME_UNIT.TWENTY_MINUTES,
    [TIME_RANGE.MONTH]: TIME_UNIT.ONE_HOUR,
} as const;

export type TimeRange = keyof typeof TIME_RANGE_UNIT_MAP;
export type TimeUnit = (typeof TIME_RANGE_UNIT_MAP)[TimeRange];
