import { ConfigurationError } from '../../error/configuration.error';
import * as process from 'node:process';

export interface ServerConfig {
    proxyServerIp: string;
    nameServerPort: number;
    ttl: number;
    authoritativeNameServers: string[];
    nameServerIp: string;
    proxyHealthCheckEndpoint: string;
    healthCheckIp:string;
}

export class ConfigurationValidator {
    static validate(): ServerConfig {
        const { PROXY_SERVER_IP, NAME_SERVER_PORT } = process.env;
        const { TTL, AUTHORITATIVE_NAME_SERVERS, NAME_SERVER_IP, PROXY_HEALTH_CHECK_ENDPOINT, PROXY_HEALTH_CHECK_IP } = process.env;

        if (
            !PROXY_SERVER_IP ||
            !NAME_SERVER_PORT ||
            !TTL ||
            !AUTHORITATIVE_NAME_SERVERS ||
            !NAME_SERVER_IP ||
            !PROXY_HEALTH_CHECK_ENDPOINT ||
            !PROXY_HEALTH_CHECK_IP
        ) {
            throw new ConfigurationError('Missing required environment variables');
        }

        return {
            proxyServerIp: PROXY_SERVER_IP,
            nameServerPort: parseInt(NAME_SERVER_PORT, 10),
            ttl: parseInt(TTL, 10),
            authoritativeNameServers: AUTHORITATIVE_NAME_SERVERS.split(',').map((s) => s.trim()),
            nameServerIp: NAME_SERVER_IP,
            proxyHealthCheckEndpoint: PROXY_HEALTH_CHECK_ENDPOINT,
            healthCheckIp :PROXY_HEALTH_CHECK_IP
        };
    }
}
