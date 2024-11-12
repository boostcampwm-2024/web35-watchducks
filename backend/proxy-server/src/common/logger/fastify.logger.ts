import type { FastifyInstance } from 'fastify';
import type { Logger } from './logger.interface';
import type { ErrorLog } from '../../domain/log/log.interface';
import { RequestLogEntity } from '../../domain/log/request-log.entity';
import { ResponseLogEntity } from '../../domain/log/response-log.entity';

export class FastifyLogger implements Logger {
    constructor(private readonly server: FastifyInstance) {}

    public info(log: RequestLogEntity | ResponseLogEntity | { message: string }): void {
        this.server.log.info(log);
    }

    public error(log: ErrorLog): void {
        this.server.log.error(log);
    }
}
