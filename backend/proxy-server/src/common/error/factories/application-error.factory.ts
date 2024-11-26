import { ProxyError } from '../../core/proxy.error';
import type { ApplicationErrorContext } from '../types/application-error.type';

export class ApplicationErrorFactory {
    static createError(context: ApplicationErrorContext): ProxyError {
        return new ProxyError(
            context.message,
            context.statusCode,
            context.originalError
        );
    }
}
