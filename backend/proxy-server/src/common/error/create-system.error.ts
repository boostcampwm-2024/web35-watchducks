import type { ErrorLog } from '../logger/logger.interface';

export function createSystemErrorLog(
    error: unknown,
    path: string,
    message: string,
): ErrorLog {
    return {
        method: 'SYSTEM',
        host: 'localhost',
        path,
        request: {
            method: 'SYSTEM',
            host: 'localhost',
            headers: {}
        },
        error: {
            message,
            name: error instanceof Error ? error.name : 'Error',
            stack: error instanceof Error ? error.stack : undefined,
            originalError: error
        }
    };
}