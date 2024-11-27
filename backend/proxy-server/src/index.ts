import { Application } from 'app';
import { FastifyLogger } from 'common/logger/fastify.logger';
import fastify from 'fastify';
import { SystemErrorFactory } from 'common/error/factories/system-error.factory';

async function handleShutdown(
    server: Awaited<ReturnType<Application['initialize']>>,
    logger: FastifyLogger,
    signal: string,
): Promise<void> {
    try {
        await server.stop();
        logger.info({ message: `Server stopped on ${signal}` });
        process.exit(0);
    } catch (error) {
        logger.error(
            SystemErrorFactory.createErrorLog({
                originalError: error,
                path: '/shutdown',
                message: `Error during shutdown on ${signal}`,
            }),
        );
        process.exit(1);
    }
}

async function main(): Promise<void> {
    const initializer = new Application();
    const logger = new FastifyLogger(fastify());

    try {
        const server = await initializer.initialize();
        const signals = ['SIGINT', 'SIGTERM'];

        await server.start();
        signals.forEach((signal) => {
            process.on(signal, async () => {
                await handleShutdown(server, logger, signal);
            });
        });
    } catch (error) {
        logger.error(
            SystemErrorFactory.createErrorLog({
                originalError: error,
                path: '/startup',
                message: 'Fatal error during startup',
            }),
        );
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
