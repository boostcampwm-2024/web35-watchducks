import fastify from 'fastify';
import { fastifyConfig, replyFromConfig } from './config/fastify.config';
import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { Logger } from 'common/logger/createFastifyLogger';
import { createFastifyLogger } from 'common/logger/createFastifyLogger';
import { createErrorLog } from 'common/error/system.error';
import replyFrom from '@fastify/reply-from';
import { listenConfig } from './config/server.configuration';
import { logHandler } from 'server/handler/log.handler';
import { proxyHandler } from 'server/handler/proxy.handler';
import { healthCheck } from 'server/handler/health-check.handler';
import { LogRepositoryClickhouse } from 'database/query/log.repository.clickhouse';
import { LogService } from 'domain/service/log.service';
import { LogAdapter } from 'server/adapter/log.adapter';
import { ProjectRepositoryMysql } from 'database/query/project.repository.mysql';
import { ProjectCacheRepositoryRedis } from 'database/query/project-cache.repository.redis';
import { ProjectService } from 'domain/service/project.service';
import { ProjectAdapter } from './adapter/project.adapter';

interface FastifyServer {
    listen: () => Promise<{ server: FastifyInstance; logger: Logger }>;
    stop: (server: FastifyInstance, logger: Logger) => Promise<void>;
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
    addHooks(server, logger);
    addPlugins(server);
    addRouters(server);
};

const addPlugins = (server: FastifyInstance) => {
    server.register(replyFrom, replyFromConfig);
};

const addHooks = (server: FastifyInstance, logger: Logger) => {
    const logRepository = new LogRepositoryClickhouse({ maxSize: 1000, flushIntervalSecond: 5 });
    const logService = new LogService(logRepository);
    const logAdapter = new LogAdapter(logService);

    server.addHook('onResponse', async (request, reply) =>
        logHandler(request, reply, logger, logAdapter),
    );
};

const addRouters = (server: FastifyInstance) => {
    const projectRepository = new ProjectRepositoryMysql();
    const projectCacheRepository = new ProjectCacheRepositoryRedis();
    const projectService = new ProjectService(projectRepository, projectCacheRepository);
    const projectAdapter = new ProjectAdapter(projectService);

    server.get('/health-check', (request, reply) => healthCheck(request, reply));

    server.all('*', async (request: FastifyRequest, reply: FastifyReply) =>
        proxyHandler(request, reply, projectAdapter),
    );
};
