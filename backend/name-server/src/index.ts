import { Application } from 'app';
import { logger } from 'common/utils/logger/console.logger';

async function main(): Promise<void> {
    const initializer = new Application();

    try {
        const server = await initializer.initialize();
        server.start();

        process.on('SIGINT', async () => {
            try {
                await initializer.cleanup();
                process.exit(0);
            } catch (error) {
                logger.error('exiting process ', error as Error);
                process.exit(1);
            }
        });

        process.on('SIGTERM', async () => {
            try {
                await initializer.cleanup();

                process.exit(0);
            } catch (error) {
                logger.error('exiting process ', error as Error);
                process.exit(1);
            }
        });
    } catch (error) {
        logger.error('exiting process ', error as Error);
        process.exit(1);
    }
}

main().catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
});
