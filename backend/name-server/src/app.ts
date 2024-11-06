import { config } from 'dotenv';
import { ConsoleLogger } from './utils/logger/console.logger';
import { ConfigurationValidator } from './utils/validator/configuration.validator';
import { NameServer } from './server/name-server';
import { dbPool } from './mysql/mysql';

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

const server = await initializeServer();
server.start();
const pool = await dbPool.getPool();
console.log(await pool.query('select now()'));
