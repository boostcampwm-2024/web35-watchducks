import { fastifyServer } from 'server/fastify.server';
import type { FastifyInstance } from 'fastify';
import type { Logger } from 'common/logger/createFastifyLogger';

const SIGNALS = ['SIGINT', 'SIGTERM'];

async function main() {
    const { server, logger } = await fastifyServer.listen();

    SIGNALS.forEach((signal) => {
        process.on(signal, async () => await handleShutdown(signal, server, logger));
    });
}

async function handleShutdown(signal: string, server: FastifyInstance, logger: Logger) {
    await fastifyServer.stop(server, logger);

    console.log({ message: `Server stopped on ${signal}` });
    process.exit(0);
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
