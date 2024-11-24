import { Module } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';
import { TrafficRepository } from './traffic.repository';
import { TrafficController } from './traffic.controller';
import { ClickhouseModule } from '../../clickhouse/clickhouse.module';
import { Clickhouse } from '../../clickhouse/clickhouse';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), ClickhouseModule],
    controllers: [TrafficController],
    providers: [TrafficService, TrafficRepository, Clickhouse],
})
export class TrafficModule {}
