import type { Pool, ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import mysql from 'mysql2/promise';
import { poolConfig } from './config';
import type { Server } from 'node:net';
import { DatabaseError } from '../error/database.error';

type QueryResult = RowDataPacket[] | RowDataPacket[][] | ResultSetHeader;

class MysqlDatabase {
    private static instance: MysqlDatabase;
    private pool: Pool | null = null;
    private server: Server | null = null;

    private constructor() {}

    public static getInstance(): MysqlDatabase {
        if (!MysqlDatabase.instance) {
            MysqlDatabase.instance = new MysqlDatabase();
        }
        return MysqlDatabase.instance;
    }

    public async connect(): Promise<void> {
        try {
            this.pool = mysql.createPool(poolConfig);

            await this.pool.query('SELECT 1');
        } catch (error) {
            await this.cleanup();
            throw new DatabaseError('Mysql connection failed', error);
        }
    }

    public async query<T extends QueryResult>(sql: string, params: string[]): Promise<T> {
        const pool = await this.getPool();
        const [rows] = await pool.query<T>(sql, params);

        return rows;
    }

    private async getPool(): Promise<Pool> {
        if (!this.pool) {
            await this.connect();

            return this.getPool();
        }
        return this.pool as Pool;
    }

    private async cleanup(): Promise<void> {
        if (this.pool) {
            await this.pool.end();
            this.pool = null;
        }
        if (this.server) {
            this.server.close();
            this.server = null;
        }
    }

    public async end(): Promise<void> {
        await this.cleanup();
    }
}

export const db = MysqlDatabase.getInstance();
