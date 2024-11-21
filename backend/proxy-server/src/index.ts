import { Application } from './app';
import { FastifyLogger } from './common/logger/fastify.logger';
import { createSystemErrorLog } from './common/error/create-system.error';
import fastify from 'fastify';

async function main(): Promise<void> {
    const initializer = new Application();
    const logger = new FastifyLogger(fastify());

    try {
        const server = await initializer.initialize();
        await server.start();

        process.on('SIGINT', async () => {
            try {
                await server.stop();
                process.exit(0);
            } catch (error) {
                logger.error(createSystemErrorLog(
                    error,
                    '/shutdown',
                    'Error during shutdown'
                ));
                process.exit(1);
            }
        });

        process.on('SIGTERM', async () => {
            try {
                await server.stop();
                process.exit(0);
            } catch (error) {
                logger.error(createSystemErrorLog(
                    error,
                    '/shutdown',
                    'Error during shutdown'
                ));
                process.exit(1);
            }
        });
    } catch (error) {
        logger.error(createSystemErrorLog(
            error,
            '/startup',
            'Fatal error during startup'
        ));
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});