import dotenv from 'dotenv';
import type { ForwardOptions, SshOptions } from 'tunnel-ssh';
import type { PoolOptions } from 'mysql2/promise';

dotenv.config();

export const sshConfig: SshOptions = {
    host: process.env.SSH_HOST,
    port: Number(process.env.SSH_PORT),
    username: process.env.SSH_USERNAME,
    agent: process.env.SSH_AUTH_SOCK,
};

export const tunnelConfig = {
    autoClose: true,
};

export const forwardConfig: ForwardOptions = {
    srcAddr: process.env.LOCAL_HOST,
    srcPort: Number(process.env.LOCAL_PORT),
    dstAddr: process.env.REMOTE_HOST,
    dstPort: Number(process.env.REMOTE_PORT),
};

export const serverConfig = {};

export const poolConfig: PoolOptions = {
    host: 'localhost',
    port: Number(process.env.DB_PORT),
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};
