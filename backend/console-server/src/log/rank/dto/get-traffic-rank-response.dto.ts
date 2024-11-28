import { IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TrafficRank {
    @IsString()
    projectName: string;

    @IsNumber()
    value: number;
}

export class GetTrafficRankResponseDto {
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
                value: 10000,
            },
            {
                projectName: 'test007',
                value: 9999,
            },
            {
                projectName: 'test079',
                value: 9898,
            },
        ],
    })
    rank: TrafficRank[];
}
