import type { Pool } from 'mysql2/promise';
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

    private async connect(): Promise<void> {
        try {
            this.pool = mysql.createPool(poolConfig);

            await this.pool.query('SELECT 1');
            console.log('Database pool initialized successfully');
        } catch (error) {
            console.error('Failed to setup tunnel or create pool:', error);
            await this.cleanup();
            throw error;
        }
    }

    public async getPool(): Promise<Pool> {
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

export async function initializeDatabase(): Promise<Pool> {
    try {
        const dbPool = MysqlDatabase.getInstance();
        return await dbPool.getPool();
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}

process.on('SIGINT', async () => {
    try {
        await MysqlDatabase.getInstance().end();
        console.log('Database connections cleaned up');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
});

export const dbPool = MysqlDatabase.getInstance();
