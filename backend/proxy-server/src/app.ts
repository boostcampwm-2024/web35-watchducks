import { configDotenv } from 'dotenv';
import { Server } from 'server/server';
import { ProjectRepositoryMysql } from 'database/query/project.repository.mysql';
import { ProjectService } from 'domain/project/project.service';
import { ErrorLogRepository } from 'common/logger/error-log.repository';
import { FastifyLogger } from 'common/logger/fastify.logger';
import type { ErrorLog } from 'common/logger/logger.interface';
import fastify from 'fastify';
import { ProxyService } from 'domain/proxy/proxy.service';
import { LogRepositoryClickhouse } from 'database/query/log.repository.clickhouse';
import { LogService } from 'domain/log/log.service';
import { ProjectCacheRepositoryRedis } from 'database/query/project-cache.repository.redis';

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
            const projectRepository = new ProjectRepositoryMysql();
            const projectCacheRepository = new ProjectCacheRepositoryRedis();
            const projectService = new ProjectService(projectRepository, projectCacheRepository);
            const proxyService = new ProxyService(projectService);
            const logRepository = new LogRepositoryClickhouse({
                maxSize: 1000,
                flushIntervalSecond: 5,
            });
            const logService = new LogService(logRepository);

            const errorLogRepository = new ErrorLogRepository();

            this.logger.info({ message: 'Services initialized successfully' });

            return new Server(errorLogRepository, proxyService, logService);
        } catch (error) {
            const errorLog: ErrorLog = {
                method: 'SYSTEM',
                host: 'localhost',
                path: '/initialize',
                request: {
                    method: 'SYSTEM',
                    host: 'localhost',
                    headers: {},
                },
                error: {
                    message: 'Failed to initialize application',
                    name: error instanceof Error ? error.name : 'Error',
                    stack: error instanceof Error ? error.stack : undefined,
                    originalError: error,
                },
            };
            this.logger.error(errorLog);
            throw error;
        }
    }
}
