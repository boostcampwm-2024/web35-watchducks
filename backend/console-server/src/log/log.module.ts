import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { ClickhouseModule } from '../clickhouse/clickhouse.module';
import { LogService } from './log.service';
import { LogRepository } from './log.repository';
import { ElapsedTimeModule } from './elapsed-time/elapsed-time.module';
import { TrafficModule } from './traffic/traffic.module';
import { SuccessRateModule } from './success-rate/success-rate.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        ClickhouseModule,
        ElapsedTimeModule,
        TrafficModule,
        SuccessRateModule,
    ],
    providers: [LogService, LogRepository],
    controllers: [LogController],
})
export class LogModule {}
