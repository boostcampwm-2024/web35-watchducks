import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import type { ErrorHandler } from 'server/error.handler';
import type {ProxyHandler} from 'domain/proxy/proxy.handler';

export class RouterManager {
    constructor(
        private readonly server: FastifyInstance,
        private readonly proxyHandler: ProxyHandler,
        private readonly errorHandler: ErrorHandler,
    ){}

    initialize():void{
        this.initializeRoutes();
        this.initializeErrorHandler();
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
