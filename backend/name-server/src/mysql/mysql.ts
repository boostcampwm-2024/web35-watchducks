import { createTunnel } from 'tunnel-ssh';
import type { Pool } from 'mysql2/promise';
import mysql from 'mysql2/promise';
import { forwardConfig, poolConfig, sshConfig, tunnelConfig, serverConfig } from './config';
import type { Server } from 'node:net';

class DatabasePool {
    private static instance: DatabasePool;
    private pool: Pool | null = null;
    private server: Server | null = null;

    private constructor() {}

    public static getInstance(): DatabasePool {
        if (!DatabasePool.instance) {
            DatabasePool.instance = new DatabasePool();
        }
        return DatabasePool.instance;
    }

    private async setupTunnel(): Promise<void> {
        try {
            this.server = (
                await createTunnel(tunnelConfig, serverConfig, sshConfig, forwardConfig)
            )[0];
            console.log('SSH 터널링 성공!');

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
            await this.setupTunnel();
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

    public async isConnected(): Promise<boolean> {
        try {
            if (!this.pool) return false;
            await this.pool.query('SELECT 1');
            return true;
        } catch {
            return false;
        }
    }
}

export async function initializeDatabase(): Promise<Pool> {
    try {
        const dbPool = DatabasePool.getInstance();
        return await dbPool.getPool();
    } catch (error) {
        console.error('Failed to initialize database:', error);
        throw error;
    }
}

process.on('SIGINT', async () => {
    try {
        await DatabasePool.getInstance().end();
        console.log('Database connections cleaned up');
        process.exit(0);
    } catch (error) {
        console.error('Error during cleanup:', error);
        process.exit(1);
    }
});

export const dbPool = DatabasePool.getInstance();
