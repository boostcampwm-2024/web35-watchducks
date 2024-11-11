import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import replyFrom from '@fastify/reply-from';
import { ProxyError } from '../error/core/proxy.error';
import type { ProxyService } from './proxy-service';
import { fastifyConfig } from './config/fastify.config';
import { HOST_HEADER } from '../common/constant/http.constant';
import type { RequestLog, ResponseLog } from '../common/interface/log.interface';
import { ProxyErrorHandler } from '../error/core/proxy-error.handler';
import { FastifyLogger } from '../common/logger/fastify.logger';

export class ProxyServerFastify {
    private readonly server: FastifyInstance;
    private readonly errorHandler: ProxyErrorHandler;
    private readonly logger: FastifyLogger;

    constructor(private readonly proxyService: ProxyService) {
        this.server = fastify(fastifyConfig);
        this.logger = new FastifyLogger(this.server);
        this.errorHandler = new ProxyErrorHandler({ logger: this.logger });

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
            const requestLog: RequestLog = {
                message: 'Request received',
                method: request.method,
                hostname: request.hostname,
                url: request.url,
                path: request.raw.url,
            };

            this.logger.info(requestLog);
            done();
        });

        this.server.addHook('onResponse', (request, reply, done) => {
            const responseLog: ResponseLog = {
                message: 'Response completed',
                method: request.method,
                hostname: request.hostname,
                url: request.url,
                path: request.raw.url,
                statusCode: reply.statusCode,
                statusMessage: reply.raw.statusMessage,
                responseTime: reply.elapsedTime,
            };

            this.logger.info(responseLog);
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

    private async handleProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            await this.executeProxyRequest(request, reply);
        } catch (error) {
            throw this.errorHandler.handleError(error as Error, request);
        }
    }

    private async executeProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const host = this.proxyService.validateHost(request.headers[HOST_HEADER]);
        const ip = await this.proxyService.resolveDomain(host);
        const targetUrl = this.proxyService.buildTargetUrl(ip, request.url);

        await this.sendProxyRequest(targetUrl, request, reply);
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
            this.server.log.error('Failed to start proxy server:', error);
            console.error('Detailed error:', error);
            process.exit(1);
        }
    }

    public async stop(): Promise<void> {
        try {
            await this.server.close();
            this.logger.info({ message: 'Proxy server stopped' });
        } catch (error) {
            this.server.log.error('Error while stopping proxy server:', error);
            process.exit(1);
        }
    }
}
