import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class GetTrafficByGenerationResponseDto {
    @ApiProperty({
        example: 15,
        description: '기수 별 트래픽 수',
        type: Number,
    })
    @Expose()
    count: number;
}
