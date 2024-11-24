import { ClickhouseError } from '../core/clickhouse.error';

export class TimeSeriesQueryBuilderError extends ClickhouseError {
    constructor(message: string, error?: Error) {
        super(message, error);
        super.name = 'TimeSeriesQueryBuilderError';
    }
}
