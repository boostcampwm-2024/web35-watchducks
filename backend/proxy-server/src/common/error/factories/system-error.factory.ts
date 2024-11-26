import type { SystemErrorLogContext } from '../../../common/error/types/system-error.type';
import type { ErrorLog } from '../../../common/logger/logger.interface';

export class SystemErrorFactory {
    static createErrorLog(context: SystemErrorLogContext): ErrorLog {
        return {
            method: 'SYSTEM',
            host: 'localhost',
            path: context.path,
            request: {
                method: 'SYSTEM',
                host: 'localhost',
                headers: {}
            },
            error: {
                message: context.message,
                name: context.originalError instanceof Error ? context.originalError.name : 'Error',
                stack: context.originalError instanceof Error ? context.originalError.stack : undefined,
                originalError: context.originalError
            }
        };
    }
}
