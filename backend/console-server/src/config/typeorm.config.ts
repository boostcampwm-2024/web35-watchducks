import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const getTypeOrmConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const isTestEnv = configService.get<string>('NODE_ENV') === 'test';

  return isTestEnv
    ? {
        type: 'sqlite',
        database: ':memory:',
        dropSchema: true,
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      }
    : {
        type: 'mysql',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: true,
      };
};
