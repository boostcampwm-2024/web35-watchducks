import type { RowDataPacket } from 'mysql2/promise';
import { TestDatabase } from './test-database';
import type { ProjectQueryInterface } from '../../src/database/query/project.query.interface';

interface ProjectExists extends RowDataPacket {
    exists_flag: number;
}

interface ProjectClientIp extends RowDataPacket {
    ip: string;
}

export class TestProjectQuery implements ProjectQueryInterface {
    private readonly db = new TestDatabase();
    private readonly EXIST = 1;

    constructor() {}

    async existsByDomain(name: string): Promise<boolean> {
        const sql = `SELECT EXISTS(SELECT 1
                                   FROM project
                                   WHERE domain = ?) as exists_flag`;
        const params = [name];
        const rows = await this.db.query<ProjectExists[]>(sql, params);

        return rows[0].exists_flag === this.EXIST;
    }


    async getClientIpByDomain(domain: string): Promise<string> {
        const sql = `SELECT ip
                     FROM project
                     WHERE domain = ?`;
        const params = [domain];
        const rows = await this.db.query<ProjectClientIp[]>(sql, params);

        if (rows.length === 0) {
            throw new Error(`No client IP found for domain: ${domain}`);
        }

        return rows[0].ip;
    }
}
