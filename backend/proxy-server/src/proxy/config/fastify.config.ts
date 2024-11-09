import fastify from 'fastify';

export const fastifyConfig = fastify({
    logger: {
        level: process.env.LOG_LEVEL || 'info',
        serializers: {
            req(request) {
                return {
                    method: request.method,
                    url: request.url,
                    host: request.headers.host,
                };
            },
        },
    },
    bodyLimit: Number(process.env.BODY_LIMIT),
});
