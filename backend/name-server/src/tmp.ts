import { config } from 'dotenv';
import { ConsoleLogger } from './utils/logger/console.logger';
import { ConfigurationValidator } from './utils/validator/configuration.validator';
import { NameServer } from './server/name-server';

config();

async function initializeServer(): Promise<NameServer> {
    try {
        const config = ConfigurationValidator.validate();
        const logger = new ConsoleLogger();

        return new NameServer(config, logger);
    } catch (error) {
        console.error('Failed to initialize server:', error);
        process.exit(1);
    }
}

(async () => {
    const server = await initializeServer();
    server.start();
})();
