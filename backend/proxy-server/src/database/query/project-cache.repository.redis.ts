import { RedisClient } from 'database/redis/redis-database';
import { ProjectCacheRepository } from 'domain/project/project-cache.repository';

export class ProjectCacheRepositoryRedis implements ProjectCacheRepository {
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
