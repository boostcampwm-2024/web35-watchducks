import { ProxyServer } from './server/proxy-server';
import { configDotenv } from 'dotenv';
import { LogService } from './domain/log/log.service';
import { LogRepositoryClickhouse } from './database/query/log.repository.clickhouse';
import { ProjectRepositoryMysql } from './database/query/project.repository.mysql';
import { ProjectService } from './domain/project/project.service';
import { ErrorLogRepository } from './common/logger/error-log.repository';

configDotenv();

const logRepository = new LogRepositoryClickhouse();
const logService = new LogService(logRepository);

const projectRepository = new ProjectRepositoryMysql();
const projectService = new ProjectService(projectRepository);

const errorLogRepository = new ErrorLogRepository();

const proxyServerFastify = new ProxyServer(logService, projectService, errorLogRepository);

proxyServerFastify.start();
