import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetElapsedTimeRankDto {
    @ApiProperty({ description: '기수', example: 9 })
    @Type(() => Number)
    @IsNumber()
    generation: number;
}
