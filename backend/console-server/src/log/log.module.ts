import { Module } from '@nestjs/common';
import { LogService } from './log.service';
import { LogController } from './log.controller';
import { LogRepository } from './log.repository';
import { Clickhouse } from '../clickhouse/clickhouse';

@Module({
    controllers: [LogController],
    providers: [LogService, LogRepository, Clickhouse],
})
export class LogModule {}
