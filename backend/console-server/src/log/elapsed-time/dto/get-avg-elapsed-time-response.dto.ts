import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetAvgElapsedTimeResponseDto {
    @ApiProperty({
        example: '35.353',
        description: '해당 기수의 전체 트래픽 평균 응답시간',
    })
    @Expose()
    avgResponseTime: number;
}
