import type { FastifyInstance } from 'fastify';
import type { Logger } from './logger.interface';
import type { RequestLog, ResponseLog, ErrorLog } from '../interface/log.interface';

export class FastifyLogger implements Logger {
    constructor(private readonly server: FastifyInstance) {}

    public info(log: RequestLog | ResponseLog | { message: string }): void {
        this.server.log.info(log);
    }

    public error(log: ErrorLog): void {
        this.server.log.error(log);
    }
}
