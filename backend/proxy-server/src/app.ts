import { configDotenv } from 'dotenv';
import { Server } from './server/server';
import { LogService } from './domain/log/log.service';
import { LogRepositoryClickhouse } from './database/query/log.repository.clickhouse';
import { ProjectRepositoryMysql } from './database/query/project.repository.mysql';
import { ProjectService } from './domain/project/project.service';
import { ErrorLogRepository } from './common/logger/error-log.repository';
import { FastifyLogger } from './common/logger/fastify.logger';
import type { ErrorLog } from './common/logger/logger.interface';
import fastify from 'fastify';
import { ProxyService } from 'domain/proxy/proxy.service';

export class Application {
    private readonly logger: FastifyLogger;

    constructor() {
        this.logger = new FastifyLogger(fastify());
        this.initializeConfig();
    }

    private initializeConfig(): void {
        configDotenv();
    }

    public async initialize(): Promise<Server> {
        try {
            const logRepository = new LogRepositoryClickhouse();
            const logService = new LogService(logRepository);

            const projectRepository = new ProjectRepositoryMysql();
            const projectService = new ProjectService(projectRepository);
            const proxyService = new ProxyService(projectService, this.logger);

            const errorLogRepository = new ErrorLogRepository();

            this.logger.info({ message: 'Services initialized successfully' });

            return new Server(logService, projectService, errorLogRepository, proxyService);
        } catch (error) {
            const errorLog: ErrorLog = {
                method: 'SYSTEM',
                host: 'localhost',
                path: '/initialize',
                request: {
                    method: 'SYSTEM',
                    host: 'localhost',
                    headers: {}
                },
                error: {
                    message: 'Failed to initialize application',
                    name: error instanceof Error ? error.name : 'Error',
                    stack: error instanceof Error ? error.stack : undefined,
                    originalError: error
                }
            };
            this.logger.error(errorLog);
            throw error;
        }
    }
}