import fastify from 'fastify';
import { fastifyConfig, replyFromConfig } from './config/fastify.config';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Logger } from 'common/logger/createFastifyLogger';
import { createFastifyLogger } from 'common/logger/createFastifyLogger';
import { createErrorLog } from 'common/error/system.error';
import replyFrom from '@fastify/reply-from';
import { listenConfig } from './config/server.configuration';
import { proxyHandler } from 'server/handler/proxy.handler';
import { healthCheck } from 'server/handler/health-check.handler';
import type { LogAdapter } from 'server/adapter/log.adapter';
import type { ProjectAdapter } from './adapter/project.adapter';
import { container, TOKENS } from 'common/container/container';

interface FastifyServer {
    listen: () => Promise<{ server: FastifyInstance; logger: Logger }>;
    stop: (server: FastifyInstance, logger: Logger) => Promise<void>;
}

export interface Locals {
    originalContentType?: string;
}

export const fastifyServer: FastifyServer = {
    listen: () => startFastifyServer(),
    stop: (server: FastifyInstance, logger: Logger) => stopFastifyServer(server, logger),
};

const startFastifyServer = async () => {
    const server = fastify(fastifyConfig);
    const logger = createFastifyLogger(server);

    try {
        initialize(server, logger);
        await server.listen(listenConfig);

        logger.info({ message: `Proxy server is running on port ${process.env.PORT}` });
    } catch (error) {
        logger.error(
            createErrorLog({
                originalError: error,
                path: '/server/start',
                message: 'Failed to start server',
            }),
        );

        throw error;
    }

    return { server, logger };
};

const stopFastifyServer = async (server: FastifyInstance, logger: Logger) => {
    const SHUTDOWN_TIMEOUT = 10000;

    try {
        logger.info({ message: 'Starting proxy server shutdown' });

        const closePromise = server.close();
        const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error('Server shutdown timeout')), SHUTDOWN_TIMEOUT),
        );

        await Promise.race([closePromise, timeoutPromise]);
        logger.info({ message: 'Proxy server stopped' });
    } catch (error) {
        logger.error(
            createErrorLog({
                originalError: error,
                path: '/server/stop',
                message: 'Error while stopping server',
            }),
        );

        throw error;
    }
};

const initialize = (server: FastifyInstance, logger: Logger) => {
    addPlugins(server);
    addRouters(server, logger);
};

const addPlugins = (server: FastifyInstance) => {
    server.register(replyFrom, replyFromConfig);
    server.addHook('preHandler', async (request, reply) => {
        const locals: Locals = {
            originalContentType: request.headers['content-type'],
        };

        (request as any).locals = locals;
    });
};

const addRouters = (server: FastifyInstance, logger: Logger) => {
    const projectAdapter = container.resolve<ProjectAdapter>(TOKENS.PROJECT_ADAPTER);
    const logAdapter = container.resolve<LogAdapter>(TOKENS.LOG_ADAPTER);

    server.get('/health-check', (request, reply) => healthCheck(request, reply));

    server.all('*', async (request: FastifyRequest, reply: FastifyReply) =>
        proxyHandler(request, reply, projectAdapter, logAdapter, logger),
    );
};
