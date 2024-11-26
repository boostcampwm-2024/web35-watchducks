import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import { fastifyConfig } from './config/fastify.config';
import { ErrorHandler } from './error.handler';
import { FastifyLogger } from '../common/logger/fastify.logger';
import type { ErrorLogRepository } from '../common/logger/error-log.repository';
import { ProxyHandler } from '../domain/proxy/proxy.handler';
import type { ProxyService } from 'domain/proxy/proxy.service';
import { ServerConfiguration } from 'server/config/server.configuration';
import { ServerInitializer } from 'server/config/server.initializer';
import { SystemErrorFactory } from 'common/error/factories/system-error.factory';
import { LogHandler } from 'domain/log/log.handler';
import type { LogService } from 'domain/log/log.service';

export class Server {
    private readonly SHUTDOWN_TIMEOUT = 30000;
    private readonly server: FastifyInstance;
    private readonly configuration: ServerConfiguration;
    private readonly routerManager: ServerInitializer;
    private readonly logger: FastifyLogger;

    constructor(
        private readonly errorLogRepository: ErrorLogRepository,
        private readonly proxyService: ProxyService,
        private readonly logService:LogService,
    ) {
        this.server = fastify(fastifyConfig);
        this.logger = new FastifyLogger(this.server);

        const errorHandler = new ErrorHandler({ logger: this.logger }, errorLogRepository);
        const proxyHandler = new ProxyHandler(proxyService);
        const logHandler = new LogHandler(logService, this.logger);

        this.configuration = new ServerConfiguration(this.server);
        this.routerManager = new ServerInitializer(this.server, proxyHandler, errorHandler, logHandler)

        this.initialize();
    }

    private initialize(): void {
        this.configuration.initialize();
        this.routerManager.initialize();
    }

    public async start(): Promise<void> {
        try {
            await this.server.listen(this.configuration.getListenOptions());
            this.logger.info({ message: `Proxy server is running on port ${process.env.PORT}` });
        } catch (error) {
            this.logger.error(SystemErrorFactory.createErrorLog({
                originalError: error,
                path: '/server/start',
                message: 'Failed to start server'
            }));
            process.exit(1);
        }
    }

    public async stop(): Promise<void> {
        try {
            this.logger.info({ message: 'Starting proxy server shutdown' });

            const closePromise = this.server.close();
            const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('Server shutdown timeout')), this.SHUTDOWN_TIMEOUT)
            );

            await Promise.race([closePromise, timeoutPromise]);
            this.logger.info({ message: 'Proxy server stopped' });
        } catch (error) {
            this.logger.error(SystemErrorFactory.createErrorLog({
                originalError: error,
                path: '/server/stop',
                message: 'Error while stopping server'
            }));
            throw error;
        }
    }
}