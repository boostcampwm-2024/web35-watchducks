import { IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetTrafficDailyDifferenceDto {
    @IsNumber()
    @Type(() => Number)
    @ApiProperty({
        description: '기수',
        example: 9,
        required: true,
    })
    generation: number;
}
