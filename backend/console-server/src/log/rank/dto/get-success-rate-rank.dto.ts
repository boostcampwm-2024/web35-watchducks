import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSuccessRateRankDto {
    @ApiProperty({ description: '기수', example: 9 })
    @Type(() => Number)
    @IsNumber()
    generation: number;
}
