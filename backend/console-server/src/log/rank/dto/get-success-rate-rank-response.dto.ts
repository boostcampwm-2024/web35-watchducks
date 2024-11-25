import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsString } from 'class-validator';

export class SuccessRateRank {
    @IsString()
    projectName: string;

    @Type(() => Number)
    @IsNumber()
    successRate: number;
}

export class GetSuccessRateRankResponseDto {
    @ApiProperty({
        description: '총 갯수',
        example: 30,
    })
    @IsNumber()
    total: number;

    @ApiProperty({
        description: '응답 성공률 순위',
        example: 'watchducks',
    })
    @Expose()
    rank: SuccessRateRank[];
}
