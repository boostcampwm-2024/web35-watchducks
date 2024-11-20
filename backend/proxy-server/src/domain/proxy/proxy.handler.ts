import type { FastifyReply, FastifyRequest } from 'fastify';
import { buildTargetUrl, validateHost, validateIp } from '../../server/utils';
import { HOST_HEADER } from '../../common/constant/http.constant';
import { ProxyError } from '../../common/core/proxy.error';
import { DatabaseQueryError } from '../../common/error/database-query.error';
import type { ErrorHandler } from '../../server/error.handler';
import type { FastifyLogger } from '../../common/logger/fastify.logger';
import type { ProjectService } from '../../domain/project/project.service';

export class ProxyHandler {
    constructor(
        private readonly projectService: ProjectService,
        private readonly logger: FastifyLogger,
        private readonly errorHandler: ErrorHandler,
    ) {}

    async handleProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        await this.executeProxyRequest(request, reply);
    }

     async executeProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const host = validateHost(request.headers[HOST_HEADER]);
        const ip = await this.resolveDomain(host);
        const targetUrl = buildTargetUrl(ip, request.url, 'https://'); // TODO: Protocol 별 arg 세팅

        await this.sendProxyRequest(targetUrl, request, reply);
    }

     async resolveDomain(host: string): Promise<string> {
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

     async sendProxyRequest(
        targetUrl: string,
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<void> {
         await reply.from(targetUrl, {
             onError: (reply, error) => {
                 throw new ProxyError(
                     '프록시 요청 처리 중 오류가 발생했습니다.',
                     502,
                     error.error,
                 );
             },
         });
    }
}
