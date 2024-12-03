import type { CacheQueryInterface } from '../../src/database/query/cache.query.interface';

export class TestCacheQuery implements CacheQueryInterface {
    private cache: Map<string, string>;

    constructor(initialData?: Record<string, string>) {
        this.cache = new Map<string, string>(initialData ? Object.entries(initialData) : []);
    }

    async findIpByDomain(domain: string): Promise<string | null> {
        return this.cache.get(domain) || null;
    }

    async cacheIpByDomain(domain: string, ip: string): Promise<void> {
        this.cache.set(domain, ip);
    }
}
