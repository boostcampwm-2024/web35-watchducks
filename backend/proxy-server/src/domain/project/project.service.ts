import type { ProjectRepository } from './project.repository';
import type { ProjectCacheRepository } from 'domain/project/project-cache.repository';

export class ProjectService {
    constructor(
        private readonly projectRepository: ProjectRepository,
        private readonly projectCacheRepository: ProjectCacheRepository,
    ) {}

    async getIpByDomain(domain: string) {
        const projectEntity = await this.projectRepository.findIpByDomain(domain);

        return projectEntity.ip;
    }

    async getCachedIpByDomain(domain: string) {
        return await this.projectCacheRepository.findIpByDomain(domain);
    }

    async cacheIpByDomain(domain: string, ip: string) {
        this.projectCacheRepository.cacheIpByDomain(domain, ip);
    }
}
