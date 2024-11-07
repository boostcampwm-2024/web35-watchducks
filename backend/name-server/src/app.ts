import { config } from 'dotenv';
import { ConsoleLogger } from './utils/logger/console.logger';
import { ConfigurationValidator } from './utils/validator/configuration.validator';
import { NameServer } from './server/name-server';
import { db } from './mysql/mysql-database';

config();

async function initializeServer(): Promise<NameServer> {
    try {
        const config = ConfigurationValidator.validate();
        const logger = new ConsoleLogger();

        await db.connect(); // initialize mysql connection pool

        return new NameServer(config, logger);
    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

const server = await initializeServer();

server.start();

process.on('SIGINT', async () => {
    try {
        await db.end();

        console.log('Database connections cleaned up');

        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);

        process.exit(1);
    }
});
