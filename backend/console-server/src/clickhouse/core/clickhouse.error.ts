import { Logger } from '@nestjs/common';

export class ClickhouseError extends Error {
    constructor(
        message: string,
        originalError?: Error,
        private readonly logger = new Logger(ClickhouseError.name, { timestamp: true }),
    ) {
        super(message);

        this.logger.error(
            `${this.name}: ${message}`,
            originalError ? { originalError } : undefined,
        );
    }
}
