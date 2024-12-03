import { RedisClient } from 'database/redis/redis-database';

export interface CacheQueryInterface {
    findIpByDomain(domain: string): Promise<string | null>;
    cacheIpByDomain(domain: string, ip: string): Promise<void>;
}
