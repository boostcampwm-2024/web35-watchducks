import { MysqlDatabase } from '../mysql/mysql-database';
import type { RowDataPacket } from 'mysql2/promise';
import { ProjectRepository } from '../../domain/project/project.repository';
import { ProjectEntity } from '../../domain/project/project.entity';

export interface ProjectRow extends RowDataPacket {
    ip: string;
}

export class ProjectRepositoryMysql implements ProjectRepository {
    private readonly mysqlDatabase: MysqlDatabase;
    constructor() {
        this.mysqlDatabase = MysqlDatabase.getInstance();
    }

    async findIpByDomain(domain: string): Promise<ProjectEntity> {
        const sql = `SELECT ip
                     FROM project
                     WHERE domain = ?`;
        const params = [domain];
        const rows = await this.mysqlDatabase.query<ProjectRow[]>(sql, params);

        return this.mapToEntity(rows[0]);
    }

    private mapToEntity(row: ProjectRow) {
        return new ProjectEntity(row);
    }
}
