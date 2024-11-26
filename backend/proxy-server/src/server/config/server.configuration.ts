import replyFrom from '@fastify/reply-from';
import type { FastifyInstance } from 'fastify';

export class ServerConfiguration{
    constructor(private readonly server : FastifyInstance){}

    initialize():void{
        this.initializePlugins();
    }

    private initializePlugins(): void {
        this.server.register(replyFrom, {
            undici: {
                connections: Number(process.env.DEFAULT_CONNECTIONS),
                pipelining: Number(process.env.DEFAULT_PIPELINING),
                keepAliveTimeout: Number(process.env.DEFAULT_KEEP_ALIVE),
                connect: {
                    rejectUnauthorized: false,
                },
            },
        });
    }
    getListenOptions() {
        return {
            port: Number(process.env.PORT),
            host: process.env.LISTENING_HOST,
        };
    }
}
