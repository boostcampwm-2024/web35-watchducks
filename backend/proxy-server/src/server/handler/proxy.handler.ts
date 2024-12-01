import type { FastifyRequest } from 'fastify';
import type { FastifyReply } from 'fastify/types/reply';
import { ProxyError } from 'common/core/proxy.error';
import type { ProjectAdapter } from 'server/adapter/project.adapter';

export const proxyHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
    projectAdapter: ProjectAdapter,
) => {
    const targetUrl = await projectAdapter.resolveTargetUrl(request);
    console.log(targetUrl);

    return sendProxyRequest(targetUrl, reply);
};

const sendProxyRequest = async (targetUrl: string, reply: FastifyReply): Promise<void> => {
    return reply.from(targetUrl, {
        onError: (reply, error) => {
            throw new ProxyError('프록시 요청 처리 중 오류가 발생했습니다.', 502, error.error);
        },
    });
};
