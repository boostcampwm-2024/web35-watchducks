import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class GetTrafficTop5Dto {
    @ApiProperty({
        example: 9,
        description: '기수',
        type: 'number',
    })
    @Type(() => Number)
    @IsNumber()
    @IsNotEmpty()
    @Expose()
    generation: number;
}
