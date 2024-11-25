import { Module } from '@nestjs/common';
import { ClickhouseModule } from '../../clickhouse/clickhouse.module';
import { RankService } from './rank.service';
import { RankRepository } from './rank.repository';
import { Clickhouse } from '../../clickhouse/clickhouse';
import { RankController } from './rank.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../project/entities/project.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Project]), ClickhouseModule],
    controllers: [RankController],
    providers: [RankService, RankRepository, Clickhouse],
})
export class RankModule {}
