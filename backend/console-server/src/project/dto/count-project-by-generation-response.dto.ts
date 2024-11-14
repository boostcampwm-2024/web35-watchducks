import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CountProjectByGenerationResponseDto {
    @ApiProperty({
        example: '5',
        description: '부스트캠프 기수',
    })
    @Type(() => Number)
    generation: number;

    @ApiProperty({
        example: '42',
        description: '해당 기수의 프로젝트 총 개수',
    })
    @Type(() => Number)
    count: number;
}
