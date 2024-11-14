import type { HttpLogEntity } from '../../domain/log/http-log.entity';
import type { BaseLog } from '../../domain/core/base-log';

export interface ErrorLog extends BaseLog {
    request: {
        method: string;
        host: string;
        path?: string;
        headers: {
            'user-agent'?: string | undefined;
            'content-type'?: string | undefined;
            'x-forwarded-for'?: string | string[] | undefined;
        };
    };
    error: {
        message: string;
        name: string;
        stack?: string;
        originalError?: unknown;
    };
}

export interface Logger {
    info(log: HttpLogEntity | { message: string }): void;
    error(log: ErrorLog): void;
}
