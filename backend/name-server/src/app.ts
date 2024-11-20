import { config } from 'dotenv';
import type { ServerConfig } from 'common/utils/validator/configuration.validator';
import { ConfigurationValidator } from 'common/utils/validator/configuration.validator';
import { Server } from 'server/server';
import { db } from 'database/mysql/mysql-database';
import { logger } from 'common/utils/logger/console.logger';
import { ProjectQuery } from 'database/query/project.query';
import { DAURecorder } from 'database/query/dau-recorder';

config();

export class Application {
    constructor() {}

    public async initialize(): Promise<Server> {
        await this.initializeDatabase();

        const config = await this.initializeConfig();
        const dauRecorder = new DAURecorder();
        const projectQuery = new ProjectQuery();

        return new Server(config, dauRecorder, projectQuery);
    }

    public async cleanup(): Promise<void> {
        try {
            await db.end();
            logger.info('Database connections cleaned up');
        } catch (error) {
            logger.error('Cleanup failed:', error);
            throw error;
        }
    }

    private async initializeConfig(): Promise<ServerConfig> {
        return ConfigurationValidator.validate();
    }

    private async initializeDatabase(): Promise<void> {
        await db.connect();
        logger.info('MySql Database connection established');
    }
}
