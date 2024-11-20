import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetTrafficByGenerationDto {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        description: '기수',
        example: 5,
        required: true,
    })
    generation: number;
}
