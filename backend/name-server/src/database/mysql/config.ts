import dotenv from 'dotenv';
import type { PoolOptions } from 'mysql2/promise';

dotenv.config();

export const poolConfig: PoolOptions =
    process.env.NODE_ENV === 'development'
        ? {
              host: process.env.DEV_DB_HOST,
              port: Number(process.env.DEV_DB_PORT),
              user: process.env.DEV_DB_USERNAME,
              password: process.env.DEV_DB_PASSWORD,
              database: process.env.DEV_DB_NAME,
          }
        : {
              host: process.env.DB_HOST,
              port: Number(process.env.DB_PORT),
              user: process.env.DB_USERNAME,
              password: process.env.DB_PASSWORD,
              database: process.env.DB_NAME,
          };
