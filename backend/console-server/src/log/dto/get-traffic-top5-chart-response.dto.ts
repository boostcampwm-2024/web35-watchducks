import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class TrafficTop5Chart {
    name: string;
    traffic: [string, string][];
}

export class GetTrafficTop5ChartResponseDto {
    @ApiProperty({
        example: [
            {
                name: 'watchducks',
                traffic: [
                    ['2024-01-01 11:12:00', '100'],
                    ['2024-01-02 11:13:00', '100'],
                    ['2024-01-02 11:14:00', '100'],
                    ['2024-01-02 11:15:00', '100'],
                ],
            },
        ],
        description: '해당 기수의 트래픽 Top5 프로젝트에 대한 작일 차트 데이터',
    })
    @Expose()
    trafficCharts: TrafficTop5Chart[];
}
