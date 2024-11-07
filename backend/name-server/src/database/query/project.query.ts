import { db } from '../mysql/mysql-database';
import type { RowDataPacket } from 'mysql2/promise';

interface ProjectExists extends RowDataPacket {
    exists_flag: number;
}

class ProjectQuery {
    private static instance: ProjectQuery;
    private readonly db = db;
    private readonly EXIST = 1;

    private constructor() {}

    public static getInstance(): ProjectQuery {
        if (!ProjectQuery.instance) {
            ProjectQuery.instance = new ProjectQuery();
        }
        return ProjectQuery.instance;
    }

    async existsByDomain(name: string): Promise<boolean> {
        const sql = `SELECT EXISTS(SELECT 1
                                   FROM project
                                   WHERE domain = ?) as exists_flag`;
        const params = [name];
        const rows = await this.db.query<ProjectExists[]>(sql, params);

        return rows[0].exists_flag === this.EXIST;
    }
}

export const projectQuery = ProjectQuery.getInstance();
