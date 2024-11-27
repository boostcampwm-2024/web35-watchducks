import { Expose, Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTrafficRankDto {
    @ApiProperty({
        example: '9',
    })
    @Type(() => Number)
    @IsNumber()
    @Expose()
    generation: number;
}
