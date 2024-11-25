import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { ClickhouseModule } from '../../clickhouse/clickhouse.module';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { AnalyticsController } from './analytics.controller';
import { AnalyticsService } from './analytics.service';
import { AnalyticsRepository } from './analytics.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), ClickhouseModule],
    providers: [AnalyticsService, AnalyticsRepository, Clickhouse],
    controllers: [AnalyticsController],
})
export class AnalyticsModule {}
