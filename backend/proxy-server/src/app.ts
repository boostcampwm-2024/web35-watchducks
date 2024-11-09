import { ProxyServerFetch } from './proxy-server-fetch';
import { ProxyServerStream } from './proxy-server-stream';
import { ProxyServerFastify } from './proxy-server-fastify';

const proxyServerFetch = new ProxyServerFetch({ port: 3100 });
const proxyServerFastify = new ProxyServerFastify({ port: 3200 });
const proxyServerStream = new ProxyServerStream({ port: 3300 });

proxyServerFetch.start();
proxyServerStream.start();
proxyServerFastify.start();
