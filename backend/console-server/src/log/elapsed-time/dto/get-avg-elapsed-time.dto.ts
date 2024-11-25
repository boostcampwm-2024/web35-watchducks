import { IsNotEmpty, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GetAvgElapsedTimeDto {
    @IsNotEmpty()
    @IsNumber()
    @ApiProperty({
        example: 9,
        description: '기수',
        type: 'number',
    })
    @Type(() => Number)
    @Expose()
    generation: number;
}
