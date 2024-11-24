import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { ClickhouseModule } from '../../clickhouse/clickhouse.module';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { AnalyticController } from './analytic.controller';
import { AnalyticService } from './analytic.service';
import { AnalyticRepository } from './analytic.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), ClickhouseModule],
    providers: [AnalyticService, AnalyticRepository, Clickhouse],
    controllers: [AnalyticController],
})
export class AnalyticModule {}
