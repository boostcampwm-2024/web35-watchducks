import { Module } from '@nestjs/common';
import { LogController } from './log.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../project/entities/project.entity';
import { ClickhouseModule } from '../clickhouse/clickhouse.module';
import { ElapsedTimeModule } from './elapsed-time/elapsed-time.module';
import { TrafficModule } from './traffic/traffic.module';
import { SuccessRateModule } from './success-rate/success-rate.module';
import { AnalyticModule } from './analytic/analytic.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project]),
        ClickhouseModule,
        ElapsedTimeModule,
        TrafficModule,
        SuccessRateModule,
        AnalyticModule,
    ],
    controllers: [LogController],
})
export class LogModule {}
