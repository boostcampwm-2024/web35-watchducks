import { ProxyServerFastify } from './proxy/proxy-server-fastify';
import { ProxyService } from './proxy/proxy-service';
import { configDotenv } from 'dotenv';

configDotenv();

const proxyServerFastify = new ProxyServerFastify(new ProxyService());

proxyServerFastify.start();
