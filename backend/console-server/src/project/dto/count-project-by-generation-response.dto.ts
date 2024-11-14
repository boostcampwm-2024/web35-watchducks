import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CountProjectByGenerationResponseDto {
    @ApiProperty({
        example: '42',
        description: '해당 기수의 프로젝트 총 개수',
    })
    @Type(() => Number)
    count: number;
}
