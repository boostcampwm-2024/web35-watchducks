import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import fastify from 'fastify';
import type { HTTPMethods } from 'fastify/types/utils';

interface ProxyConfig {
    readonly port: number;
}

type SupportedHttpMethods = Exclude<Lowercase<HTTPMethods>, 'trace' | 'options'>;

export class ProxyServerFetch {
    private readonly server: FastifyInstance;
    private readonly supportedMethods: SupportedHttpMethods[] = [
        'get',
        'post',
        'put',
        'delete',
        'patch',
    ];

    constructor(private readonly config: ProxyConfig) {
        this.server = fastify({
            logger: false,
            bodyLimit: 10485760, // 10MB
            forceCloseConnections: true,
        });
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.supportedMethods.forEach((method) => {
            this.server.route({
                method: method.toUpperCase() as HTTPMethods,
                url: '*',
                handler: this.handleRequest.bind(this),
            });
        });
    }

    private async handleRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const host = request.headers.host;

        if (!host) {
            reply.code(400).send({ error: 'Host header is required' });
            return;
        }

        try {
            const targetUrl = new URL(request.url, `http://${host}`);

            const response = await fetch(targetUrl.toString(), {
                method: request.method,
                headers: this.filterHeaders(request.headers),
                body: ['GET', 'HEAD'].includes(request.method)
                    ? undefined
                    : JSON.stringify(request.body),
            });

            const responseHeaders = Object.fromEntries(response.headers.entries());
            reply
                .code(response.status)
                .headers(responseHeaders)
                .send(await response.text());
        } catch (error) {
            reply.code(502).send({
                error: 'Bad Gateway',
                message: (error as Error).message,
            });
        }
    }

    private filterHeaders(headers: Record<string, string | string[] | undefined>): HeadersInit {
        const filteredHeaders: Record<string, string> = {};
        const excludedHeaders = new Set([
            'host',
            'connection',
            'content-length',
            'transfer-encoding',
        ]);

        Object.entries(headers).forEach(([key, value]) => {
            if (!excludedHeaders.has(key.toLowerCase()) && value !== undefined) {
                filteredHeaders[key] = Array.isArray(value) ? value[0] : value;
            }
        });

        return filteredHeaders;
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
