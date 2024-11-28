import type { FastifyReply, FastifyRequest } from 'fastify';
import { ProxyError } from '../../common/core/proxy.error';
import { HOST_HEADER } from '../../common/constant/http.constant';
import type { ProxyService } from '../../domain/proxy/proxy.service';

export class ProxyHandler {
    constructor(private readonly proxyService: ProxyService) {}

    async handleProxyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const targetUrl = await this.proxyService.resolveTargetUrl(
            request.headers[HOST_HEADER] as string,
            request.url,
            request.protocol,
        );

        this.sendProxyRequest(targetUrl, request, reply);
    }

    async sendProxyRequest(
        targetUrl: string,
        request: FastifyRequest,
        reply: FastifyReply,
    ): Promise<void> {
        reply.from(targetUrl, {
            onError: (reply, error) => {
                throw new ProxyError('프록시 요청 처리 중 오류가 발생했습니다.', 502, error.error);
            },
        });
    }
}
