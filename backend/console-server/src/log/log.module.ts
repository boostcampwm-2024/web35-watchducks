import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { LogRepository } from './log.repository';
import { Clickhouse } from '../clickhouse/clickhouse';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project])],
    controllers: [LogController],
    providers: [LogService, LogRepository, Clickhouse],
})
export class LogModule {}
