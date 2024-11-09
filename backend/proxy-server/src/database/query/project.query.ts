import { db } from '../mysql/mysql-database';
import type { RowDataPacket } from 'mysql2/promise';

interface ProjectIp extends RowDataPacket {
    ip: string;
}

class ProjectQuery {
    private static instance: ProjectQuery;
    private readonly db = db;

    private constructor() {}

    public static getInstance(): ProjectQuery {
        if (!ProjectQuery.instance) {
            ProjectQuery.instance = new ProjectQuery();
        }
        return ProjectQuery.instance;
    }

    async findIpByDomain(domain: string): Promise<string> {
        const sql = `SELECT ip
                     FROM project
                     WHERE domain = ?`;
        const params = [domain];
        const rows = await this.db.query<ProjectIp[]>(sql, params);

        console.log('rows: ', rows);

        return rows[0].ip;
    }
}

export const projectQuery = ProjectQuery.getInstance();
