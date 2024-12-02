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
        this.healthCheckInterval = setInterval(this.checkHealth.bind(this), this.healthCheckIntervalMs);
    }

    public stopHealthCheck(): void {
        if (this.healthCheckInterval) {
            clearInterval(this.healthCheckInterval);
            this.healthCheckInterval = null;
        }
        this.cleanActiveRequest();
    }

    private cleanActiveRequest(): void {
        if (this.activeRequest) {
            this.activeRequest.destroy();
            this.activeRequest = null;
        }
    }

    private handleHealthCheckFailure(error: Error, message: string): void {
        this.proxyServerHealthy = false;
        this.activeRequest = null;
        logger.error(message, error);
    }

    private createRequestOptions(): http.RequestOptions {
        return {
            hostname: this.proxyServerIp,
            port: 443,
            path: this.proxyHealthCheckEndpoint,
            method: 'GET',
            timeout: this.timeoutMs
        };
    }

    private handleResponse(res: http.IncomingMessage): void {
        let data = '';
        const timeoutId = setTimeout(() => {
            this.proxyServerHealthy = false;
            res.destroy();
            logger.error('Response reading timeout');
        }, this.timeoutMs);

        res.on('data', chunk => data += chunk);

        res.on('error', error => {
            clearTimeout(timeoutId);
            this.handleHealthCheckFailure(error, 'Error reading response:');
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
    }

    private checkHealth(): void {
        this.cleanActiveRequest();

        try {
            this.activeRequest = http.request(
                this.createRequestOptions(),
                this.handleResponse.bind(this)
            );

            this.activeRequest.on('error', error =>
                this.handleHealthCheckFailure(error, 'Proxy server health check failed:')
            );

            this.activeRequest.on('timeout', () => {
                this.proxyServerHealthy = false;
                this.cleanActiveRequest();
                logger.error('Proxy server health check timeout');
            });

            this.activeRequest.end();

        } catch (error) {
            this.handleHealthCheckFailure(error as Error, 'Failed to create health check request:');
        }
    }
}