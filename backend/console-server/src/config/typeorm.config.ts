import { registerAs } from '@nestjs/config';
import type { TypeOrmModuleOptions } from '@nestjs/typeorm';

export default registerAs('typeOrmConfig', () => {
    const isDevEnv = ['development', 'test', 'debug'].includes(process.env.NODE_ENV as string);
    return (
        isDevEnv
            ? {
                  type: 'mysql',
                  host: process.env.DEV_MYSQL_HOST,
                  port: process.env.DEV_MYSQL_PORT,
                  username: process.env.DEV_MYSQL_USERNAME,
                  password: process.env.DEV_MYSQL_PASSWORD,
                  database: process.env.DEV_MYSQL_DATABASE,
                  autoLoadEntities: true,
                  synchronize: false,
              }
            : {
                  type: 'mysql',
                  host: process.env.DB_HOST,
                  port: process.env.DB_PORT,
                  username: process.env.DB_USERNAME,
                  password: process.env.DB_PASSWORD,
                  database: process.env.DB_NAME,
                  autoLoadEntities: true,
                  synchronize: false,
              }
    ) as TypeOrmModuleOptions;
});
