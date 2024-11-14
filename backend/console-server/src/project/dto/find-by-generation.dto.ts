import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class FindByGenerationDto {
    @ApiProperty({
        example: '9',
        description: '부스트캠프 기수',
    })
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    generation: number;
}
