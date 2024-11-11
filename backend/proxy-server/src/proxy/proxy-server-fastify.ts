import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import replyFrom from '@fastify/reply-from';
import { ProxyError } from '../error/core/proxy.error';
import type { ProxyService } from './proxy-service';
import { isProxyError } from '../error/core/proxy-error.type.guard';
import { fastifyConfig } from './config/fastify.config';
import { HOST_HEADER } from '../common/constant/http.constant';

export class ProxyServerFastify {
    private readonly server: FastifyInstance;

    constructor(private readonly proxyService: ProxyService) {
        this.server = fastify(fastifyConfig);

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
            this.server.log.info({
                message: 'Request received',
                method: request.method,
                hostname: request.hostname,
                url: request.url,
                path: request.raw.url,
            });
            done();
        });
        this.server.addHook('onResponse', (request, reply, done) => {
            this.server.log.info({
                message: 'Response completed',
                method: request.method,
                hostname: request.hostname,
                url: request.url,
                path: request.raw.url,
                statusCode: reply.statusCode,
                statusMessage: reply.raw.statusMessage,
                responseTime: reply.elapsedTime,
            });
            done();
        });
    }

    private initializeErrorHandler(): void {
        this.server.setErrorHandler((error, request, reply) => {
            const proxyError = isProxyError(error)
                ? error
                : new ProxyError('내부 서버 오류가 발생했습니다.', 500, error);

            this.server.log.error({
                message: 'Error occurred',
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
            });

            reply.status(proxyError.statusCode).send({
                error: proxyError.message,
                statusCode: proxyError.statusCode,
            });
        });
    }

    private async handleProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        try {
            const host = this.proxyService.validateHost(request.headers[HOST_HEADER]);
            const ip = await this.proxyService.resolveDomain(host);
            const targetUrl = this.proxyService.buildTargetUrl(ip, request.url);

            await new Promise<void>((resolve, reject) => {
                reply.from(targetUrl, {
                    onError: (reply, error) => {
                        this.server.log.error({
                            message: 'Proxy request failed',
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
                                message: error.error.message,
                                name: error.error.name,
                                stack: error.error.stack,
                                originalError: error.error,
                            },
                        });
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
        } catch (error) {
            throw error instanceof ProxyError
                ? error
                : new ProxyError('예기치 않은 오류가 발생했습니다.', 500, error as Error);
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
