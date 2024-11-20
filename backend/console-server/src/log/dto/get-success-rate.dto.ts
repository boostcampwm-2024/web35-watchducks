import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class GetSuccessRateDto {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        description: '기수',
        example: 5,
        required: true,
    })
    generation: number;
}
