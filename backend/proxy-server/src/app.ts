import { ProxyServerFetch } from './proxy-server-fetch';
import { ProxyServerStream } from './proxy-server-stream';

const proxyServerFetch = new ProxyServerFetch({ port: 3100 });
const proxyServerStream = new ProxyServerStream({ port: 3200 });

proxyServerFetch.start();
proxyServerStream.start();
