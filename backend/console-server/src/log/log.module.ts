import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { ClickhouseModule } from '../clickhouse/clickhouse.module';
import { LogService } from './log.service';
import { LogRepository } from './log.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), ClickhouseModule],
    providers: [LogService, LogRepository],
    controllers: [LogController],
})
export class LogModule {}
