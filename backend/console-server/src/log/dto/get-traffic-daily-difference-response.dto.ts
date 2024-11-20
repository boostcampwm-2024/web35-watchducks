import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetTrafficDailyDifferenceResponseDto {
    @ApiProperty({
        example: '+9100',
        description: '전일 대비 총 트래픽 증감량',
        type: String,
    })
    @Expose()
    traffic_daily_difference: string;
}
