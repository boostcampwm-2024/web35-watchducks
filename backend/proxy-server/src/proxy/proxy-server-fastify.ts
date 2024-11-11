import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import replyFrom from '@fastify/reply-from';
import { ProxyError } from '../error/core/proxy.error';
import type { ProxyService } from './proxy-service';
import { isProxyError } from '../error/core/proxy-error.type.guard';
import { fastifyConfig } from './config/fastify.config';
import { HOST_HEADER } from '../common/constant/http.constant';
import type { ErrorLog, RequestLog, ResponseLog } from '../common/interface/log.interface';
import { FastifyLogger } from '../common/logger/fastify.logger';

export class ProxyServerFastify {
    private readonly server: FastifyInstance;
    private readonly logger: FastifyLogger;

    constructor(private readonly proxyService: ProxyService) {
        this.server = fastify(fastifyConfig);
        this.logger = new FastifyLogger(this.server);

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
            const proxyError = isProxyError(error)
                ? error
                : new ProxyError('내부 서버 오류가 발생했습니다.', 500, error);

            const errorLog: ErrorLog = {
                message: 'Error occurred',
                method: request.method,
                hostname: request.hostname,
                url: request.url,
                path: request.raw.url,
                request: {
                    method: request.method,
                    hostname: request.hostname,
                    url: request.url,
                    path: request.raw.url,
                    headers: {
                        'user-agent': request.headers['user-agent'],
                        'content-type': request.headers['content-type'],
                        'x-forwarded-for': request.headers['x-forwarded-for'],
                    },
                },
                error: {
                    message: proxyError.message,
                    name: proxyError.name,
                    stack: proxyError.stack,
                    originalError: proxyError.originalError,
                },
            };

            this.logger.error(errorLog);

            reply.status(proxyError.statusCode).send({
                error: proxyError.message,
                statusCode: proxyError.statusCode,
            });
        });
    }

    private createErrorLog(message: string, request: FastifyRequest, error: ProxyError): ErrorLog {
        return {
            message,
            method: request.method,
            hostname: request.hostname,
            url: request.url,
            path: request.raw.url ?? '',
            request: {
                method: request.method,
                hostname: request.hostname,
                url: request.url,
                path: request.raw.url ?? '',
                headers: {
                    'user-agent': request.headers['user-agent'],
                    'content-type': request.headers['content-type'],
                    'x-forwarded-for': request.headers['x-forwarded-for'],
                },
            },
            error: {
                message: error.message,
                name: error.name,
                stack: error.stack,
                originalError: error.originalError,
            },
        };
    }

    private async handleProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const host = this.proxyService.validateHost(request.headers[HOST_HEADER]);
            const ip = await this.proxyService.resolveDomain(host);
            const targetUrl = this.proxyService.buildTargetUrl(ip, request.url);

            await new Promise<void>((resolve, reject) => {
                reply.from(targetUrl, {
                    onError: (reply, error) => {
                        const proxyError = new ProxyError(
                            '프록시 요청 처리 중 오류가 발생했습니다.',
                            502,
                            error.error,
                        );
                        const errorLog = this.createErrorLog(
                            'Proxy request failed',
                            request,
                            proxyError,
                        );

                        this.logger.error(errorLog);
                        reject(proxyError);
                    },
                });
            });
        } catch (error) {
            const proxyError =
                error instanceof ProxyError
                    ? error
                    : new ProxyError('예기치 않은 오류가 발생했습니다.', 500, error as Error);

            const errorLog: ErrorLog = {
                message: 'Proxy request failed',
                method: request.method,
                hostname: request.hostname,
                url: request.url,
                path: request.raw.url,
                request: {
                    method: request.method,
                    hostname: request.hostname,
                    url: request.url,
                    path: request.raw.url,
                    headers: {
                        'user-agent': request.headers['user-agent'],
                        'content-type': request.headers['content-type'],
                        'x-forwarded-for': request.headers['x-forwarded-for'],
                    },
                },
                error: {
                    message: proxyError.message,
                    name: proxyError.name,
                    stack: proxyError.stack,
                    originalError: proxyError.originalError,
                },
            };

            this.logger.error(errorLog);
            throw proxyError;
        }
    }

    public async start(): Promise<void> {
        try {
            await this.server.listen({
                port: Number(process.env.PORT),
                host: process.env.LISTENING_HOST,
            });
            this.server.log.info(`Proxy server is running on port ${process.env.PORT}`);
        } catch (error) {
            this.server.log.error('Failed to start proxy server:', error);
            process.exit(1);
        }
    }

    public async stop(): Promise<void> {
        try {
            await this.server.close();
            this.server.log.info('Proxy server stopped');
        } catch (error) {
            this.server.log.error('Error while stopping proxy server:', error);
            process.exit(1);
        }
    }
}
