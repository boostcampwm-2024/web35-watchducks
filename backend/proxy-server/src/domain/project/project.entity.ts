import { ProjectRow } from '../../database/query/project.repository.mysql';

interface Project extends ProjectRow {}

export class ProjectEntity {
    readonly ip: string;

    constructor(project: Project) {
        this.ip = project.ip;
    }
}
