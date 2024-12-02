import type { ProjectRow } from 'database/query/project.repository.mysql';

type Project = ProjectRow;

export class ProjectEntity {
    readonly ip: string;

    constructor(project: Project) {
        this.ip = project.ip;
    }
}
