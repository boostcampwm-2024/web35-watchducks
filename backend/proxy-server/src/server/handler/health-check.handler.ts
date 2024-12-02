import type { FastifyReply } from 'fastify/types/reply';
import type { FastifyRequest } from 'fastify/types/request';

type HealthResponse = {
    status: string;
    timestamp: string;
};

export const healthCheck = async (_request: FastifyRequest, reply: FastifyReply) => {
    const response: HealthResponse = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
    };

    return reply.code(200).send(response);
};
