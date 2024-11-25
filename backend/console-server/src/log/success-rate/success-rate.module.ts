import { SuccessRateController } from './success-rate.controller';
import { SuccessRateService } from './success-rate.service';
import { Module } from '@nestjs/common';
import { ClickhouseModule } from '../../clickhouse/clickhouse.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { SuccessRateRepository } from './success-rate.repository';
import { Clickhouse } from 'src/clickhouse/clickhouse';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), ClickhouseModule],
    controllers: [SuccessRateController],
    providers: [SuccessRateService, SuccessRateRepository, Clickhouse],
})
export class SuccessRateModule {}
