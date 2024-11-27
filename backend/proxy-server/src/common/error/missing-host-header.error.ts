import { ProxyError } from '../core/proxy.error';
import { ErrorMessage } from '../../common/constant/error-message.constant';
import { HttpStatus } from '../../common/constant/http-status.constant';

export class MissingHostHeaderError extends ProxyError {
    constructor() {
        super(
            ErrorMessage.VALIDATION.MISSING_HOST_HEADER,
            HttpStatus.BAD_REQUEST
        );
        this.name = 'MissingHostHeaderError';
    }
}