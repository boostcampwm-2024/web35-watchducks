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
        example: [
            {
                projectName: 'test059',
                successRate: 98.23100936524453,
            },
            {
                projectName: 'test007',
                successRate: 98.1094527363184,
            },
            {
                projectName: 'test079',
                successRate: 98.0083857442348,
            },
        ],
    })
    @Expose()
    rank: SuccessRateRank[];
}
