import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ValidateNested } from 'class-validator';

export class TrafficCountByTimeUnit {
    @ApiProperty({
        example: '2024-11-07 23:00:00',
        description: '시간 단위 별 타임스탬프',
    })
    @Expose()
    timestamp: string;

    @ApiProperty({
        example: 1500,
        description: '해당 타임스탬프의 트래픽 총량',
    })
    @Expose()
    @Type(() => Number)
    count: number;
}

export class GetTrafficByProjectResponseDto {
    @ApiProperty({
        example: 'watchducks',
        description: '프로젝트 이름',
    })
    @Expose()
    projectName: string;

    @ApiProperty({
        example: 'www.example.com',
        description: '도메인 주소',
    })
    @Expose()
    domain: string;

    @ApiProperty({
        example: 'day',
        description: '데이터 범위',
    })
    @Expose()
    timeRange: string;

    @ApiProperty({
        example: '30',
        description: '해당 기간 트래픽 총합',
    })
    @Expose()
    total: number;

    @ApiProperty({
        type: [TrafficCountByTimeUnit],
        description: '시간 범위 별 트래픽 데이터',
    })
    @Expose()
    @Type(() => TrafficCountByTimeUnit)
    @ValidateNested()
    trafficData: TrafficCountByTimeUnit[];
}
