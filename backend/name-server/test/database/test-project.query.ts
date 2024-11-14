import type { RowDataPacket } from 'mysql2/promise';
import { TestDatabase } from './test-database';
import { ProjectQueryInterface } from '../../src/database/query/project.query.interface';

interface ProjectExists extends RowDataPacket {
    exists_flag: number;
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
}
