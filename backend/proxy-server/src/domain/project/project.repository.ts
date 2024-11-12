import { ProjectEntity } from './project.entity';

export interface ProjectRepository {
    findIpByDomain(domain: string): Promise<ProjectEntity>;
}
