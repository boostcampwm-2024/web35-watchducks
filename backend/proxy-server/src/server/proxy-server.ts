import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import replyFrom from '@fastify/reply-from';
import { ProxyError } from '../common/core/proxy.error';
import { buildTargetUrl, validateHost, validateIp } from './utils';
import { fastifyConfig } from './config/fastify.config';
import { HOST_HEADER } from '../common/constant/http.constant';
import { ErrorHandler } from './error.handler';
import { FastifyLogger } from '../common/logger/fastify.logger';
import { LogService } from '../domain/log/log.service';
import { RequestLogEntity } from '../domain/log/request-log.entity';
import { ResponseLogEntity } from '../domain/log/response-log.entity';
import { ProjectService } from '../domain/project/project.service';
import { DatabaseQueryError } from '../common/error/database-query.error';
import { ErrorLog } from '../common/logger/logger.interface';
import { ErrorLogRepository } from '../common/logger/error-log.repository';

export class ProxyServer {
    private readonly server: FastifyInstance;
    private readonly errorHandler: ErrorHandler;
    private readonly logger: FastifyLogger;

    constructor(
        private readonly logService: LogService,
        private readonly projectService: ProjectService,
        private readonly errorLogRepository: ErrorLogRepository,
    ) {
        this.server = fastify(fastifyConfig);
        this.logger = new FastifyLogger(this.server);
        this.errorHandler = new ErrorHandler({ logger: this.logger }, errorLogRepository);

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
            },
        });
    }

    private initializeRoutes(): void {
        this.server.all('*', this.handleProxyRequest.bind(this));
    }

    private initializeHooks(): void {
        this.server.addHook('onRequest', (request, reply, done) => {
            this.logRequest(request);
            done();
        });

        this.server.addHook('onResponse', (request, reply, done) => {
            this.logResponse(request, reply);
            done();
        });
    }

    private async logRequest(request: FastifyRequest): Promise<void> {
        const requestLog: RequestLogEntity = {
            method: request.method,
            host: request.host,
            path: request.raw.url,
        };

        this.logger.info(requestLog);

        await this.logService.saveRequestLog(requestLog);
    }

    private async logResponse(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const responseLog: ResponseLogEntity = {
            method: request.method,
            host: request.host,
            path: request.raw.url,
            statusCode: reply.statusCode,
            responseTime: reply.elapsedTime,
        };

        this.logger.info(responseLog);
        // await this.logService.saveResponseLog(responseLog);
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

    private async handleProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await this.executeProxyRequest(request, reply);
        } catch (error) {
            throw this.errorHandler.handleError(error as Error, request);
        }
    }

    private async executeProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const host = validateHost(request.headers[HOST_HEADER]);
        const ip = await this.resolveDomain(host);
        const targetUrl = buildTargetUrl(ip, request.url, 'http://'); // TODO: Protocol 별 arg 세팅

        await this.sendProxyRequest(targetUrl, request, reply);
    }

    private async resolveDomain(host: string): Promise<string> {
        try {
            const ip = await this.projectService.getIpByDomain(host);

            validateIp(ip, host);

            return ip;
        } catch (error) {
            if (error instanceof ProxyError) {
                throw error;
            }
            throw new DatabaseQueryError(error as Error);
        }
    }

    private async sendProxyRequest(
        targetUrl: string,
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<void> {
        await new Promise<void>((resolve, reject) => {
            reply.from(targetUrl, {
                onError: (reply, error) => {
                    reject(
                        new ProxyError(
                            '프록시 요청 처리 중 오류가 발생했습니다.',
                            502,
                            error.error,
                        ),
                    );
                },
            });
        });
    }

    public async start(): Promise<void> {
        try {
            await this.server.listen({
                port: Number(process.env.PORT),
                host: process.env.LISTENING_HOST,
            });
            this.logger.info({ message: `Proxy server is running on port ${process.env.PORT}` });
        } catch (error) {
            this.server.log.error('Failed to start server server:', error);
            console.error('Detailed error:', error);
            process.exit(1);
        }
    }

    public async stop(): Promise<void> {
        try {
            await this.server.close();
            this.logger.info({ message: 'Proxy server stopped' });
        } catch (error) {
            this.server.log.error('Error while stopping server server:', error);
            process.exit(1);
        }
    }
}
