import { ConfigurationError } from '../../error/configuration.error';
import * as process from 'node:process';

export interface ServerConfig {
    proxyServerIp: string;
    nameServerPort: number;
    ttl: number;
    nameServerDomainFirst: string;
    nameServerDomainSecond: string;
}

export class ConfigurationValidator {
    static validate(): ServerConfig {
        const { PROXY_SERVER_IP, NAME_SERVER_PORT } = process.env;
        const { TTL, NS_DOMAIN_FIRST, NS_DOMAIN_SECOND } = process.env;

        if (
            !PROXY_SERVER_IP ||
            !NAME_SERVER_PORT ||
            !TTL ||
            !NS_DOMAIN_FIRST ||
            !NS_DOMAIN_SECOND
        ) {
            throw new ConfigurationError('Missing required environment variables');
        }

        return {
            proxyServerIp: PROXY_SERVER_IP,
            nameServerPort: parseInt(NAME_SERVER_PORT, 10),
            ttl: parseInt(TTL, 10),
            nameServerDomainFirst: NS_DOMAIN_FIRST,
            nameServerDomainSecond: NS_DOMAIN_SECOND,
        };
    }
}
