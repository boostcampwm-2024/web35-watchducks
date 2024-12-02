export interface ProjectCacheRepository {
    findIpByDomain(domain: string): Promise<string | null>;
    cacheIpByDomain(domain: string, ip: string): Promise<void>;
}
