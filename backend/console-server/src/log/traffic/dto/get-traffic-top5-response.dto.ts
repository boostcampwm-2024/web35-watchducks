import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsString, ValidateNested } from 'class-validator';

export class TrafficRankData {
    @IsNotEmpty()
    @IsString()
    projectName: string;

    @IsNotEmpty()
    @IsNumber()
    count: number;
}

export class GetTrafficTop5ResponseDto {
    @ApiProperty({
        example: [
            { projectName: 'watchducks01', count: 100 },
            { projectName: 'watchducks02', count: 99 },
            { projectName: 'watchducks03', count: 98 },
            { projectName: 'watchducks04', count: 97 },
            { projectName: 'watchducks05', count: 96 },
        ],
        description: '트래픽 수가 가장 많은 Top5 호스트, 트래픽 수',
    })
    @Expose()
    @ValidateNested()
    rank: TrafficRankData[];
}
