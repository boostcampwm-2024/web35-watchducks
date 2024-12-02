import { createErrorLog } from 'common/error/system.error';
import type { FastifyReply, FastifyRequest } from 'fastify';
import type { Logger } from 'common/logger/createFastifyLogger';
import type { LogAdapter } from 'server/adapter/log.adapter';
import type { HttpLogType } from 'domain/port/input/log.use-case';

export const logHandler = (
    request: FastifyRequest,
    reply: FastifyReply,
    logger: Logger,
    logAdapter: LogAdapter,
) => {
    try {
        const ip = resolveClientIp(request);

        const httpLog: HttpLogType = {
            method: request.method,
            host: request.host,
            path: request.raw.url,
            statusCode: reply.statusCode,
            responseTime: reply.elapsedTime,
            userIp: ip,
        };

        logger.info(httpLog);
        logAdapter.saveHttpLog(httpLog);
    } catch (error) {
        logger.error(
            createErrorLog({
                originalError: error,
                path: '/log/response',
                message: 'Failed to save http log',
            }),
        );
    }
};

const resolveClientIp = (request: FastifyRequest) => {
    const originalIp =
        (request.headers['x-real-ip'] as string) ||
        (request.headers['x-forwarded-for'] as string) ||
        request.ip;

    return Array.isArray(originalIp) ? originalIp[0] : originalIp.split(',')[0].trim();
};
