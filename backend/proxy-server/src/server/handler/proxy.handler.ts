import type { FastifyRequest } from 'fastify';
import type { FastifyReply } from 'fastify/types/reply';
import { ProxyError } from 'common/core/proxy.error';
import type { ProjectAdapter } from 'server/adapter/project.adapter';
import { logHandler } from 'server/handler/log.handler';
import type { LogAdapter } from 'server/adapter/log.adapter';
import type { Logger } from 'common/logger/createFastifyLogger';
// import type { Locals } from 'server/fastify.server';

export const proxyHandler = async (
    request: FastifyRequest,
    reply: FastifyReply,
    projectAdapter: ProjectAdapter,
    logAdapter: LogAdapter,
    logger: Logger,
) => {
    const targetUrl = await projectAdapter.resolveTargetUrl(request);

    // const locals = (request as any).locals as Locals;
    // const extraHeaders: { [header: string]: string } = {};
    //
    // if (locals.originalContentType) {
    //     extraHeaders['content-type'] = locals.originalContentType;
    // }

    return sendProxyRequest(targetUrl, reply, logAdapter, logger);
};

const sendProxyRequest = async (
    targetUrl: string,
    reply: FastifyReply,
    logAdapter: LogAdapter,
    logger: Logger,
): Promise<void> => {
    return reply.from(targetUrl, {
        // rewriteRequestHeaders: (req, headers) => ({
        //     ...headers,
        //     ...extraHeaders,
        // }),
        onError: (reply, error) => {
            throw new ProxyError('프록시 요청 처리 중 오류가 발생했습니다.', 502, error.error);
        },
        onResponse: async (request, reply, res) => {
            logHandler(request as FastifyRequest, reply as FastifyReply, logger, logAdapter);

            return reply.send((res as any).stream);
        },
    });
};
