import { CustomError } from '../core/custom.error';

export class ConfigurationError extends CustomError {
    constructor(message: string, details?: unknown) {
        super(message, details);
    }
}
