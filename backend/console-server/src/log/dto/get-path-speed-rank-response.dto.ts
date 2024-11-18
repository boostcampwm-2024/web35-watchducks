import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

class PathResponseDto {
    @ApiProperty({
        example: '/api/v1/resource',
        description: '사용자의 요청 경로',
    })
    @Expose()
    path: string;

    @ApiProperty({
        example: 123.45,
        description: '해당 경로의 평균 응답 소요 시간 (ms).',
    })
    @Expose()
    elapsed_time: number;
}

@Exclude()
export class GetPathSpeedRankResponseDto {
    @ApiProperty({
        example: 'watchducks',
        description: '프로젝트 이름',
    })
    @Expose()
    projectName: string;

    @ApiProperty({
        type: [PathResponseDto],
        description: '프로젝트의 가장 빠른 응답 경로 배열',
    })
    @Expose()
    @Type(() => PathResponseDto)
    fastestPaths: Array<PathResponseDto>;

    @ApiProperty({
        type: [PathResponseDto],
        description: '프로젝트의 가장 느린 응답 경로 배열',
    })
    @Expose()
    @Type(() => PathResponseDto)
    slowestPaths: Array<PathResponseDto>;
}
