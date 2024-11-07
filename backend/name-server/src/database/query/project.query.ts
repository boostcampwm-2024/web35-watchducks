import { db } from '../mysql/mysql-database';
import type { RowDataPacket } from 'mysql2/promise';

interface ProjectExists extends RowDataPacket {
    exists_flag: number;
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

    async findByDomain(name: string): boolean {
        const sql = `SELECT EXISTS(SELECT 1
                                   FROM project
                                   WHERE domain = ?) as exists_flag`;
        const params = [name];
        const rows = await db.query<ProjectExists[]>(sql, params);

        console.log(rows);

        return true;
        // return result[0]['exists_flag'] === 1;
    }
}

export const projectQuery = ProjectQuery.getInstance();
