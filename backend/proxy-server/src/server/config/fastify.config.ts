import type { FastifyRequest, RawRequestDefaultExpression, RouteGenericInterface } from 'fastify';
import type { IncomingMessage, ServerResponse } from 'node:http';
import type * as http from 'node:http';
import { configDotenv } from 'dotenv';

configDotenv();

export const fastifyConfig = {
    logger:
        process.env.NODE_ENV === 'development'
            ? true
            : {
                  level: process.env.LOG_LEVEL || 'warning',
                  serializers: {
                      req(
                          request: FastifyRequest<
                              RouteGenericInterface,
                              http.Server<typeof IncomingMessage, typeof ServerResponse>,
                              RawRequestDefaultExpression<
                                  http.Server<typeof IncomingMessage, typeof ServerResponse>
                              >
                          >,
                      ) {
                          return {
                              method: request.method,
                              url: request.url,
                              host: request.headers.host,
                          };
                      },
                  },
              },
    bodyLimit: Number(process.env.BODY_LIMIT),
};

export const replyFromConfig = {
    undici: {
        connections: Number(process.env.DEFAULT_CONNECTIONS),
        pipelining: Number(process.env.DEFAULT_PIPELINING),
        keepAliveTimeout: Number(process.env.DEFAULT_KEEP_ALIVE),
        connect: {
            rejectUnauthorized: false,
        },
    },
};
