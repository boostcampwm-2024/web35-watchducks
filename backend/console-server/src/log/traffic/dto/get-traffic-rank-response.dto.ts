import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { TrafficRankMetric } from '../metric/traffic-rank.metric';

export class GetTrafficRankResponseDto {
    @ApiProperty({
        example: [
            { host: 'watchducks01', count: 100 },
            { host: 'watchducks02', count: 99 },
            { host: 'watchducks03', count: 98 },
            { host: 'watchducks04', count: 97 },
            { host: 'watchducks05', count: 96 },
        ],
        description: '트래픽 수가 가장 많은 Top5 호스트, 트래픽 수',
    })
    @Expose()
    rank: TrafficRankMetric[];
}
