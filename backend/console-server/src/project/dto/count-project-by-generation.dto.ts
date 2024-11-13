import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class CountProjectByGenerationDto {
    @ApiProperty({
        example: '5',
        description: '부스트캠프 기수',
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    generation: number;
}
