import { createClient } from '@clickhouse/client';
import { NodeClickHouseClient } from '@clickhouse/client/dist/client';
import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class Clickhouse implements OnModuleInit, OnModuleDestroy {
    private client: NodeClickHouseClient;
    private readonly logger = new Logger('clickhouse');
    private readonly MAX_RETRIES = 3;
    private readonly RETRY_DELAY = 5 * 1000; // 5s

    constructor(private readonly configService: ConfigService) {}

    async onModuleDestroy() {
        this.cleanup();
    }

    async onModuleInit() {
        await this.initialize();
    }

    private async initialize(): Promise<void> {
        for (let attempt = 1; attempt <= this.MAX_RETRIES; attempt++) {
            try {
                await this.createConnection();
                await this.ping(); // 연결 테스트

                return;
            } catch (error) {
                this.logger.error(
                    `ClickHouse connection attempt ${attempt}/${this.MAX_RETRIES} failed: ${error.message}`,
                    error.stack,
                );

                if (attempt === this.MAX_RETRIES) {
                    this.logger.error('Maximum connection attempts reached. Shutting down...');
                    this.handleFatalError(error);
                } else {
                    this.logger.log(`Retrying in ${this.RETRY_DELAY / 1000} seconds...`);
                    await this.delay(this.RETRY_DELAY);
                }
            }
        }
    }

    private async createConnection(): Promise<void> {
        try {
            const config = this.configService.get('clickhouse');
            this.client = createClient(config.clickhouse);
        } catch (error) {
            throw new Error(`Failed to initialize ClickHouse client: ${error.message}`);
        }
    }

    private async ping(): Promise<boolean> {
        try {
            await this.client.ping();
            return true;
        } catch (error) {
            this.logger.error('Ping failed:', error.message);
            return false;
        }
    }

    private handleFatalError(error: Error): never {
        this.logger.error(
            'Fatal error: Failed to connect to ClickHouse after maximum retries',
            error.stack,
        );
        this.cleanup();
        process.exit(1);
    }

    private cleanup(): void {
        try {
            if (this.client) {
                this.client.close();
            }
            this.logger.log('Cleanup completed');
        } catch (error) {
            this.logger.error('Error during cleanup:', error.stack);
        }
    }

    private delay(ms: number): Promise<void> {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async query<T extends object>(query: string, params?: Record<string, unknown>): Promise<T[]> {
        try {
            const resultSet = await this.client.query({
                query,
                format: 'JSONEachRow',
                query_params: params,
            });

            return await resultSet.json<T>();
        } catch (error) {
            this.logger.error(`Query failed: ${error.message}`);
            throw error;
        }
    }
}
