import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsString } from 'class-validator';

export class GetTrafficDailyDifferenceResponseDto {
    @ApiProperty({
        example: '+9100',
        description: '전일 대비 총 트래픽 증감량',
        type: String,
    })
    @IsString()
    @IsNotEmpty()
    @Expose()
    traffic_daily_difference: string;
}
