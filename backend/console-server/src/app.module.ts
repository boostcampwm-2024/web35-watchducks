import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectModule } from './project/project.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MailModule } from './mail/mail.module';
import typeOrmConfig from './config/typeorm.config';
import mailerConfig from './config/mailer.config';
import { ClickhouseModule } from './clickhouse/clickhouse.module';
import { LogModule } from './log/log.module';
import clickhouseConfig from './config/clickhouse.config';

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true, load: [mailerConfig, clickhouseConfig] }),
        TypeOrmModule.forRootAsync(typeOrmConfig.asProvider()),
        ProjectModule,
        ClickhouseModule,
        LogModule,
        MailModule,
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
