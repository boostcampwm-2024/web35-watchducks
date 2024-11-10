import { CustomError } from '../../common/core/custom.error';

export class DatabaseError extends CustomError {
    constructor(message: string, details?: unknown) {
        super(message, details);
    }
}
