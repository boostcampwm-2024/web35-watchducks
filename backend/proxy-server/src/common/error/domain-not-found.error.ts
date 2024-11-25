import { ProxyError } from '../core/proxy.error';
import { ErrorMessage } from 'common/constant/error-message.constant';
import { HttpStatus } from 'common/constant/http-status.constant';

export class DomainNotFoundError extends ProxyError {
    constructor(domain: string, originalError?: Error) {
        super(
            ErrorMessage.DOMAIN.NOT_FOUND(domain),
            HttpStatus.NOT_FOUND,
            originalError
        );
        this.name = 'DomainNotFoundError';
    }
}