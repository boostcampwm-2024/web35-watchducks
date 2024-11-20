import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetSuccessRateResponseDto {
    @ApiProperty({
        example: 95.5,
        description: '응답 성공률 (%)',
        type: Number,
    })
    @Expose()
    success_rate: number;
}
