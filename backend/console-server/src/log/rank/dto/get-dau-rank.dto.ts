import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class GetDAURankDto {
    @ApiProperty({ description: '기수', example: 9 })
    @Type(() => Number)
    @IsNotEmpty()
    generation: number;
}
