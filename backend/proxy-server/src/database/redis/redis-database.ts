import { createClient, RedisClientType } from 'redis';

export class RedisClient {
    private static instance: RedisClient;
    private client: RedisClientType;

    private constructor() {
        this.client = createClient({
            url: process.env.REDIS_URL,
            socket: {
                reconnectStrategy: (retries) => {
                    if (retries > 10) {
                        throw new Error('Redis 연결 최대 재시도 횟수 초과');
                    }
                    return Math.min(retries * 100, 3000);
                },
            },
        });

        this.initializeEventHandlers();
        this.connect();
    }

    private initializeEventHandlers(): void {
        this.client.on('error', (err) => console.error('Redis Client Error:', err));
        this.client.on('connect', () => console.info('Redis Client Connected'));
        this.client.on('reconnecting', () => console.info('Redis Client Reconnecting'));
    }

    public static getInstance(): RedisClient {
        if (!RedisClient.instance) {
            RedisClient.instance = new RedisClient();
        }
        return RedisClient.instance;
    }

    public async connect(): Promise<void> {
        if (!this.client.isOpen) {
            await this.client.connect();
        }
    }

    public async disconnect(): Promise<void> {
        if (this.client.isOpen) {
            await this.client.disconnect();
        }
    }

    public async set(key: string, value: string, ttlSeconds?: number): Promise<void> {
        const options = ttlSeconds ? { EX: ttlSeconds } : undefined;
        await this.client.set(key, value, options);
    }

    public async get(key: string): Promise<string | null> {
        return await this.client.get(key);
    }

    public async del(key: string): Promise<void> {
        await this.client.del(key);
    }

    public async exists(key: string): Promise<boolean> {
        const result = await this.client.exists(key);
        return result === 1;
    }
}
