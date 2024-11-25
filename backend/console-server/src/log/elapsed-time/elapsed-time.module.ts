import { ElapsedTimeController } from './elapsed-time.controller';
import { ElapsedTimeService } from './elapsed-time.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { ClickhouseModule } from '../../clickhouse/clickhouse.module';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { ElapsedTimeRepository } from './elapsed-time.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), ClickhouseModule],
    controllers: [ElapsedTimeController],
    providers: [ElapsedTimeService, ElapsedTimeRepository, Clickhouse],
})
export class ElapsedTimeModule {}
