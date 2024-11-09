import { ProxyServerFastify } from './proxy/proxy-server-fastify';
import { ProxyService } from './proxy/proxy-service';

const proxyServerFastify = new ProxyServerFastify(new ProxyService());

proxyServerFastify.start();
