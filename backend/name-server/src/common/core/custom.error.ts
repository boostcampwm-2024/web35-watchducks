import { logger } from '../utils/logger/console.logger';

export class CustomError extends Error {
    constructor(message: string, details?: Error | unknown) {
        super(message);

        logger.error(message, details);
    }
}
