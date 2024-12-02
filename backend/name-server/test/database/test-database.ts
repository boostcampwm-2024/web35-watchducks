import Database from 'better-sqlite3';
import { DatabaseError } from '../../src/database/error/database.error';

export class TestDatabase {
    private readonly db: Database.Database;

    constructor() {
        try {
            this.db = new Database(':memory:');
            this.initializeSchema();
            this.seedTestData();
        } catch (error) {
            console.log(error);
            throw new DatabaseError('Failed to initialize test database', error);
        }
    }

    private initializeSchema(): void {
        // SQLite schema syntax
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS project (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                domain TEXT NOT NULL UNIQUE,
                ip TEXT NOT NULL,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );

            CREATE INDEX IF NOT EXISTS idx_project_domain ON project(domain);
        `);
    }

    public async query<T>(sql: string, params: unknown[] = []): Promise<T> {
        try {
            const sqliteSql = this.convertToSqlite(sql);

            if (sql.trim().toLowerCase().startsWith('select')) {
                return this.db.prepare(sqliteSql).all(params) as T;
            } else {
                return this.db.prepare(sqliteSql).run(params) as T;
            }
        } catch (error) {
            throw new DatabaseError('Database query failed', error as Error);
        }
    }

    private convertToSqlite(sql: string): string {
        return (
            sql
                // Convert MySQL EXISTS syntax
                .replace(
                    /EXISTS\s*\((.*?)\)\s*as\s*([a-zA-Z_][a-zA-Z0-9_]*)/gi,
                    'CASE WHEN EXISTS($1) THEN 1 ELSE 0 END as $2',
                )
                // Add more conversions as needed
                .replace(/CURRENT_TIMESTAMP\(\)/gi, 'CURRENT_TIMESTAMP')
        );
    }

    public async seedTestData(): Promise<void> {
        try {
            await this.query(`
                INSERT INTO project (domain, ip, name) VALUES
                ('exists.test.com', '192.168.1.1', 'exists-test'),
                ('example.com', '192.168.1.2', 'example')
            `);
        } catch (error) {
            throw new DatabaseError('Failed to seed test data', error as Error);
        }
    }

    public async cleanup(): Promise<void> {
        try {
            await this.query('DELETE FROM project');
        } catch (error) {
            throw new DatabaseError('Failed to clean up test database', error as Error);
        }
    }

    public close(): void {
        this.db.close();
    }
}
