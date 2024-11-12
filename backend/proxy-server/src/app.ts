import { ProxyServer } from './server/proxy-server';
import { configDotenv } from 'dotenv';
import { LogService } from './domain/log/log.service';
import { LogRepositoryClickhouse } from './database/query/log.repository.clickhouse';
import { ProjectRepositoryMysql } from './database/query/project.repository.mysql';
import { ProjectService } from './domain/project/project.service';

configDotenv();

const logRepository = new LogRepositoryClickhouse();
const logService = new LogService(logRepository);

const projectRepository = new ProjectRepositoryMysql();
const projectService = new ProjectService(projectRepository);

const proxyServerFastify = new ProxyServer(logService, projectService);

proxyServerFastify.start();
