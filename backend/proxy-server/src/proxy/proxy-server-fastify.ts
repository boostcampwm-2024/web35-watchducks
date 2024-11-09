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

    private initializeErrorHandler(): void {
        this.server.setErrorHandler((error, request, reply) => {
            const proxyError = isProxyError(error)
                ? error
                : new ProxyError('내부 서버 오류가 발생했습니다.', 500, error);

            this.server.log.error({
                error: {
                    message: proxyError.message,
                    name: proxyError.name,
                    stack: proxyError.stack,
                    originalError: proxyError.originalError,
                },
                request: {
                    url: request.url,
                    method: request.method,
                    headers: request.headers,
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

            this.server.log.info(`Proxying request to: ${targetUrl}`);

            await reply.from(targetUrl, {
                onResponse: (request, reply, res) => {
                    // 응답 헤더 복사
                    Object.entries(res.getHeaders).forEach(([key, value]) => {
                        if (value) reply.header(key, value);
                    });
                },
                onError: (reply, error) => {
                    throw new ProxyError(
                        '프록시 요청 처리 중 오류가 발생했습니다.',
                        502,
                        error.error,
                    );
                },
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
