import { ClickhouseError } from '../core/clickhouse.error';

export class ClickhouseClientError extends ClickhouseError {
    constructor(message: string, error?: Error) {
        super(message, error);
        super.name = 'ClickhouseClientError';
    }
}
