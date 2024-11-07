import type { Pool, QueryResult } from 'mysql2/promise';
import mysql from 'mysql2/promise';
import { poolConfig } from './config';
import type { Server } from 'node:net';

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
            console.log('Database pool initialized successfully');
        } catch (error) {
            console.error('Failed to initialize connection pool:', error);
            await this.cleanup();
            throw new Error('Mysql connection failed');
        }
    }

    public async query(sql: string, params: string[]): Promise<QueryResult> {
        const pool = await this.getPool();
        const [result] = await pool.query(sql, params);

        return result;
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
