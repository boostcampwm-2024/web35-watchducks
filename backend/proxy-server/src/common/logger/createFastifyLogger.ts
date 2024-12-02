import type { FastifyInstance } from 'fastify';
import type { ErrorLog } from './logger.interface';
import type { HttpLogEntity } from 'domain/entity/http-log.entity';

export interface Logger {
    info(log: HttpLogEntity | { message: string }): void;

    error(log: ErrorLog): void;
}

export const createFastifyLogger = (server: FastifyInstance): Logger => {
    const logInfo = (log: HttpLogEntity | { message: string }): void => {
        server.log.info(log);
    };

    const logError = (log: ErrorLog): void => {
        server.log.error(log);
    };

    return {
        info: logInfo,
        error: logError,
    };
};
