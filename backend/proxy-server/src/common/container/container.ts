import { container } from 'tsyringe';
import { LogRepositoryClickhouse } from 'database/query/log.repository.clickhouse';
import { ProjectRepositoryMysql } from 'database/query/project.repository.mysql';
import { ProjectCacheRepositoryRedis } from 'database/query/project-cache.repository.redis';
import { LogService } from 'domain/service/log.service';
import { ProjectService } from 'domain/service/project.service';
import { ProjectAdapter } from 'server/adapter/project.adapter';
import { LogAdapter } from 'server/adapter/log.adapter';

export const TOKENS = {
    // Repositories
    LOG_REPOSITORY: 'LogRepository',
    PROJECT_REPOSITORY: 'ProjectRepository',
    PROJECT_CACHE_REPOSITORY: 'ProjectCacheRepository',

    // Services
    LOG_SERVICE: 'LogService',
    PROJECT_SERVICE: 'ProjectService',

    // Adapters
    LOG_ADAPTER: 'LogAdapter',
    PROJECT_ADAPTER: 'ProjectAdapter',
} as const;

// --- Repositories --- //

container.register(TOKENS.LOG_REPOSITORY, {
    useClass: LogRepositoryClickhouse,
});

container.register(TOKENS.PROJECT_REPOSITORY, {
    useClass: ProjectRepositoryMysql,
});

container.register(TOKENS.PROJECT_CACHE_REPOSITORY, {
    useClass: ProjectCacheRepositoryRedis,
});

// --- Services --- //

container.register(TOKENS.LOG_SERVICE, {
    useFactory: (container) => {
        const logRepository = container.resolve<LogRepositoryClickhouse>(TOKENS.LOG_REPOSITORY);
        return new LogService(logRepository);
    },
});

container.register(TOKENS.PROJECT_SERVICE, {
    useFactory: (container) => {
        const projectRepository = container.resolve<ProjectRepositoryMysql>(
            TOKENS.PROJECT_REPOSITORY,
        );
        const projectCacheRepository = container.resolve<ProjectCacheRepositoryRedis>(
            TOKENS.PROJECT_CACHE_REPOSITORY,
        );
        return new ProjectService(projectRepository, projectCacheRepository);
    },
});

// --- Adapters --- //

container.register(TOKENS.LOG_ADAPTER, {
    useFactory: (container) => {
        const logService = container.resolve<LogService>(TOKENS.LOG_SERVICE);
        return new LogAdapter(logService);
    },
});

container.register(TOKENS.PROJECT_ADAPTER, {
    useFactory: (container) => {
        const projectService = container.resolve<ProjectService>(TOKENS.PROJECT_SERVICE);
        return new ProjectAdapter(projectService);
    },
});

export { container };
