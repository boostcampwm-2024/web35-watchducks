import type { FastifyInstance } from 'fastify';
import type { ErrorLog, Logger } from './logger.interface';
import type { HttpLogEntity } from '../../domain/log/http-log.entity';

export class FastifyLogger implements Logger {
    constructor(private readonly server: FastifyInstance) {}

    public info(log: HttpLogEntity | { message: string }): void {
        this.server.log.info(log);
    }

    public error(log: ErrorLog): void {
        this.server.log.error(log);
    }
}
