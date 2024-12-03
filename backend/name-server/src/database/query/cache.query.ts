import { RedisClient } from 'database/redis/redis-database';

export class CacheQuery {
    readonly TTL_DAY = 24 * 60 * 60;
    private readonly redisClient: RedisClient;

    constructor() {
        this.redisClient = RedisClient.getInstance();
    }

    async findIpByDomain(domain: string): Promise<string | null> {
        return await this.redisClient.get(domain);
    }

    async cacheIpByDomain(domain: string, ip: string): Promise<void> {
        this.redisClient.set(domain, ip, this.TTL_DAY);
    }
}
