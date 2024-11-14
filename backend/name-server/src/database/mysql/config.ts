import dotenv from 'dotenv';
import type { PoolOptions } from 'mysql2/promise';

dotenv.config();

export const poolConfig: PoolOptions = {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
