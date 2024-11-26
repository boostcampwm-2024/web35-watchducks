import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ErrorHandler } from 'server/error.handler';
import type {ProxyHandler} from 'domain/proxy/proxy.handler';
import type { LogHandler } from 'domain/log/log.handler';

export class RouterManager {
    constructor(
        private readonly server: FastifyInstance,
        private readonly proxyHandler: ProxyHandler,
        private readonly errorHandler: ErrorHandler,
        private readonly logHandler: LogHandler,
    ){}

    initialize():void{
        this.initializeHooks();
        this.initializeRoutes();
        this.initializeErrorHandler();
    }

    private initializeHooks(): void {
        this.server.addHook('onResponse', async (request, reply) => {
            await this.logHandler.logResponse(request, reply);
        });
    }

    private initializeRoutes(): void {
        this.server.all('*', async (request: FastifyRequest, reply: FastifyReply) => {
            try {
                await this.proxyHandler.handleProxyRequest(request, reply);
            } catch (error) {
                throw error;
            }
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

}
