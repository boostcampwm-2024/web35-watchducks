import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import replyFrom from '@fastify/reply-from';
import { fastifyConfig } from './config/fastify.config';
import { ErrorHandler } from './error.handler';
import { FastifyLogger } from '../common/logger/fastify.logger';
import type { LogService } from '../domain/log/log.service';
import type { ProjectService } from '../domain/project/project.service';
import type { ErrorLogRepository } from '../common/logger/error-log.repository';
import { createSystemErrorLog } from '../common/error/create-system.error';
import { ProxyHandler } from '../domain/proxy/proxy.handler';
import { LogHandler } from '../domain/log/log.handler';

export class Server {
    private readonly server: FastifyInstance;
    private readonly errorHandler: ErrorHandler;
    private readonly logger: FastifyLogger;
    private readonly proxyHandler: ProxyHandler;
    private readonly logHandler: LogHandler;

    constructor(
        private readonly logService: LogService,
        private readonly projectService: ProjectService,
        private readonly errorLogRepository: ErrorLogRepository,
    ) {
        this.server = fastify(fastifyConfig);
        this.logger = new FastifyLogger(this.server);
        this.errorHandler = new ErrorHandler({ logger: this.logger }, errorLogRepository);
        this.proxyHandler = new ProxyHandler(projectService, this.logger, this.errorHandler);
        this.logHandler = new LogHandler(logService, this.logger);

        this.initializePlugins();
        this.initializeHooks();
        this.initializeRoutes();
        this.initializeErrorHandler();
    }

    private initializePlugins(): void {
        this.server.register(replyFrom, {
            undici: {
                connections: Number(process.env.DEFAULT_CONNECTIONS),
                pipelining: Number(process.env.DEFAULT_PIPELINING),
                keepAliveTimeout: Number(process.env.DEFAULT_KEEP_ALIVE),
                connect: {
                    rejectUnauthorized: false,
                },
            },
        });
    }

    private initializeRoutes(): void {
        this.server.all('*', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await this.proxyHandler.handleProxyRequest(request, reply);
            } catch (error) {
                throw this.errorHandler.handleError(error as Error, request);
            }
        });
    }

    private initializeHooks(): void {
        this.server.addHook('onResponse', (request, reply, done) => {
            this.logHandler.logResponse(request, reply);
            done();
        });
    }

    private initializeErrorHandler(): void {
        this.server.setErrorHandler((error, request, reply) => {
            const proxyError = this.errorHandler.handleError(error, request);

            reply.status(proxyError.statusCode).send({
                error: proxyError.message,
                statusCode: proxyError.statusCode,
            });
        });
    }

    private handleError(error: Error): void {
        this.logger.error(createSystemErrorLog(
            error,
            '/server',
            'Server error occurred'
        ));
        this.stop();
    }

    public async start(): Promise<void> {
        try {
            await this.server.listen({
                port: Number(process.env.PORT),
                host: process.env.LISTENING_HOST,
            });
            this.logger.info({ message: `Proxy server is running on port ${process.env.PORT}` });
        } catch (error) {
            this.logger.error(createSystemErrorLog(
                error,
                '/server/start',
                'Failed to start server'
            ));
            process.exit(1);
        }
    }

    public async stop(): Promise<void> {
        try {
            await this.server.close();
            this.logger.info({ message: 'Proxy server stopped' });
        } catch (error) {
            this.logger.error(createSystemErrorLog(
                error,
                '/server/stop',
                'Error while stopping server'
            ));
            throw error;
        }
    }
}