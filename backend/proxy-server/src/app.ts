import { ProxyServer } from './server/proxy-server';
import { Utils } from './server/utils';
import { configDotenv } from 'dotenv';
import { LogService } from './domain/log/log.service';
import { LogRepositoryClickhouse } from './database/query/log.query';

configDotenv();

const logRepository = new LogRepositoryClickhouse();
const logService = new LogService(logRepository);

const proxyServerFastify = new ProxyServer(new Utils(), logService);

proxyServerFastify.start();
