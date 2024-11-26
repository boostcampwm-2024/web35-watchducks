import { ProxyError } from '../core/proxy.error';
import { ErrorMessage } from '../../common/constant/error-message.constant';
import { HttpStatus } from '../../common/constant/http-status.constant';

export class DatabaseQueryError extends ProxyError {
    constructor(originalError?: Error) {
        super(
            ErrorMessage.DATABASE.QUERY_FAILED,
            HttpStatus.NOT_FOUND,
            originalError
        );
        this.name = 'DatabaseQueryError';
    }
}
