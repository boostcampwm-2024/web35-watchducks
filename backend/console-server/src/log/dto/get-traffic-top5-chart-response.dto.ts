import { Expose } from 'class-transformer';
import type { TrafficChartMetric } from '../metric/trafficChart.metric';
import { ApiProperty } from '@nestjs/swagger';

export class GetTrafficTop5ChartResponseDto {
    @ApiProperty({
        example: [
            {
                host: 'watchducks01',
                traffic: [
                    ['2024-01-01 11:12:00', '100'],
                    ['2024-01-02 11:13:00', '100'],
                    ['2024-01-02 11:14:00', '100'],
                    ['2024-01-02 11:15:00', '100'],
                ],
            },
        ],
        description: '해당 기수의 전체 트래픽 평균 응답시간',
    })
    @Expose()
    trafficCharts: TrafficChartMetric[];
}
