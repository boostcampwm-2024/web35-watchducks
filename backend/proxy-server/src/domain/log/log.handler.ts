import type { FastifyReply, FastifyRequest } from 'fastify';
import type { HttpLogEntity } from '../../domain/log/http-log.entity';
import type { LogService } from 'domain/log/log.service';
import type { FastifyLogger } from 'common/logger/fastify.logger';

export class LogHandler {
    constructor(
        private readonly logService: LogService,
        private readonly logger: FastifyLogger,
    ) {}

     async logResponse(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const httpLog: HttpLogEntity = {
            method: request.method,
            host: request.host,
            path: request.raw.url,
            statusCode: reply.statusCode,
            responseTime: reply.elapsedTime,
        };

        this.logger.info(httpLog);
        await this.logService.saveHttpLog(httpLog);
    }
}