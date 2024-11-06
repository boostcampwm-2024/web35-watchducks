export interface ServerConfig {
    proxyServerIp: string;
    nameServerPort: number;
}

export class ConfigurationValidator {
    static validate(): ServerConfig {
        const { PROXY_SERVER_IP, NAME_SERVER_PORT } = process.env;

        if (!PROXY_SERVER_IP || !NAME_SERVER_PORT) {
            throw new Error('Missing required environment variables');
        }

        return {
            proxyServerIp: PROXY_SERVER_IP,
            nameServerPort: parseInt(NAME_SERVER_PORT, 10),
        };
    }
}
