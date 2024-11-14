import { CustomError } from '../../common/core/custom.error';

export class ServerError extends CustomError {
    constructor(message: string, details?: Error | unknown) {
        super(message, details);
    }
}
