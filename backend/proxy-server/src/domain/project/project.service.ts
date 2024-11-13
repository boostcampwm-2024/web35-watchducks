import type { ProjectRepository } from './project.repository';

export class ProjectService {
    constructor(private readonly projectRepository: ProjectRepository) {}

    async getIpByDomain(domain: string) {
        const projectEntity = await this.projectRepository.findIpByDomain(domain);

        return projectEntity.ip;
    }
}
