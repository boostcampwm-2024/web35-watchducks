import { MysqlDatabase } from '../mysql/mysql-database';
import type { RowDataPacket } from 'mysql2/promise';
import { ProjectRepository } from 'domain/port/output/project.repository';
import { ProjectEntity } from 'domain/entity/project.entity';

export interface ProjectRow extends RowDataPacket {
    ip: string;
}

export class ProjectRepositoryMysql implements ProjectRepository {
    private readonly mysqlDatabase: MysqlDatabase;

    constructor() {
        this.mysqlDatabase = MysqlDatabase.getInstance();
    }

    async findIpByDomain(domain: string): Promise<string> {
        const sql = `SELECT ip
                     FROM project
                     WHERE domain = ?`;
        const params = [domain];
        const rows = await this.mysqlDatabase.query<ProjectRow[]>(sql, params);

        return rows[0].ip;
    }
}
