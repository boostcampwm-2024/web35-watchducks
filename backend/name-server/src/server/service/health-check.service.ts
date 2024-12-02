import * as http from 'http';
import { logger } from '../../common/utils/logger/console.logger';

export class HealthCheckService {
    private healthCheckInterval: NodeJS.Timeout | null = null;
    private proxyServerHealthy: boolean = true;
    private activeRequest: http.ClientRequest | null = null;

    constructor(
        private readonly proxyServerIp: string,
        private readonly proxyHealthCheckEndpoint: string,
        private readonly healthCheckIntervalMs: number = 5000,
        private readonly timeoutMs: number = 5000
    ) {}

    public isProxyHealthy(): boolean {
        return this.proxyServerHealthy;
    }

    public startHealthCheck(): void {
        if (this.healthCheckInterval) {
            return;
        }
        this.checkHealth();

        this.healthCheckInterval = setInterval(() => {
            this.checkHealth();
        }, this.healthCheckIntervalMs);
    }

    public stopHealthCheck(): void {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }

        if (this.activeRequest) {
            this.activeRequest.destroy();
            this.activeRequest = null;
        }
    }

    private checkHealth(): void {
        if (this.activeRequest) {
            this.activeRequest.destroy();
        }

        const options: http.RequestOptions = {
            hostname: this.proxyServerIp,
            port: 80,
            path: this.proxyHealthCheckEndpoint,
            method: 'GET',
            timeout: this.timeoutMs
        };

        try {
            this.activeRequest = http.request(options, (res) => {
                let _data = '';
                const timeoutId = setTimeout(() => {
                    this.proxyServerHealthy = false;
                    res.destroy();
                    logger.error('Response reading timeout');
                }, this.timeoutMs);

                res.on('data', (chunk) => {
                    _data += chunk;
                });

                res.on('error', (error) => {
                    clearTimeout(timeoutId);
                    this.proxyServerHealthy = false;
                    logger.error('Error reading response:', error);
                });

                res.on('end', () => {
                    clearTimeout(timeoutId);
                    this.proxyServerHealthy = res.statusCode === 200;
                    this.activeRequest = null;

                    if (!this.proxyServerHealthy) {
                        logger.info(`Proxy server health check failed with status: ${res.statusCode}`);
                    } else {
                        logger.info('Proxy server health check successful');
                    }
                });
            });

            this.activeRequest.on('error', (error) => {
                this.proxyServerHealthy = false;
                this.activeRequest = null;
                logger.error('Proxy server health check failed:', error);
            });

            this.activeRequest.on('timeout', () => {
                this.proxyServerHealthy = false;
                if (this.activeRequest) {
                    this.activeRequest.destroy();
                    this.activeRequest = null;
                }
                logger.error('Proxy server health check timeout');
            });

            this.activeRequest.end();

        } catch (error) {
            this.proxyServerHealthy = false;
            this.activeRequest = null;
            logger.error('Failed to create health check request:', error);
        }
    }
}