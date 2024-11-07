import type { FastifyInstance } from 'fastify';
import fastify from 'fastify';
import type { ProxyConfig } from '../config';
import type { IncomingMessage } from 'node:http';
import { request as httpRequest } from 'node:http';
import { Readable } from 'node:stream';
import { projectQuery } from './database/query/project.query';

export class ProxyServerStream {
    private readonly server: FastifyInstance;

    constructor(private readonly config: ProxyConfig) {
        // raw body 파싱을 위한 옵션 추가
        this.server = fastify({
            logger: false,
            bodyLimit: 10485760, // 10MB
        });
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.server.all('*', async (request, reply) => {
            const host = request.headers.host;

            if (!host) {
                reply.code(400).send({ error: 'Host header is required' });
                return;
            }

            try {
                const proxyRes = await this.createProxyStream(
                    request.method,
                    host,
                    request.url,
                    request.headers as Record<string, string>,
                    request.body,
                );

                reply.code(proxyRes.statusCode || 502).headers(proxyRes.headers);
                return reply.send(proxyRes);
            } catch (error) {
                console.error('Proxy error:', error);
                reply.code(502).send({ error: 'Bad Gateway' });
            }
        });
    }

    private createProxyStream(
        method: string,
        host: string,
        path: string,
        headers: Record<string, string>,
        body?: unknown,
    ): Promise<IncomingMessage> {
        return new Promise(async (resolve, reject) => {
            const filteredHeaders = this.filterHeaders(headers);
            const ip = await projectQuery.findIpByDomain(host);
            console.log(ip, host);

            const [hostname, port] = ip.split(':');

            if (body && !['GET', 'HEAD'].includes(method)) {
                const bodyData = JSON.stringify(body);
                filteredHeaders['content-length'] = Buffer.byteLength(bodyData).toString();
                filteredHeaders['content-type'] = 'application/json';
            }

            const req = httpRequest(
                {
                    method,
                    hostname,
                    port: port || '80',
                    path,
                    headers: filteredHeaders,
                },
                resolve,
            );

            req.on('error', reject);

            if (body && !['GET', 'HEAD'].includes(method)) {
                if (body instanceof Readable) {
                    body.pipe(req);
                } else {
                    const bodyData = JSON.stringify(body);
                    req.write(bodyData);
                    req.end();
                }
            } else {
                req.end();
            }
        });
    }

    private filterHeaders(headers: Record<string, string>): Record<string, string> {
        const filtered: Record<string, string> = {};
        const excluded = new Set([
            'host',
            'connection',
            'content-length', // content-length는 직접 계산하여 설정
        ]);

        Object.entries(headers).forEach(([key, value]) => {
            if (!excluded.has(key.toLowerCase())) {
                filtered[key] = value;
            }
        });

        return filtered;
    }

    public async start(): Promise<void> {
        try {
            await this.server.listen({ port: this.config.port, host: '0.0.0.0' });
            console.log(`Proxy server is running on port ${this.config.port}`);
        } catch (err) {
            console.error('Failed to start proxy server:', err);
            process.exit(1);
        }
    }
}
