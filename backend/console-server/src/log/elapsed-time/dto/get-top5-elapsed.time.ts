import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class ProjectElapsedTime {
    @ApiProperty({
        example: 'watchducks',
        description: '해당 프로젝트명',
    })
    @Expose()
    projectName: string;

    @ApiProperty({
        example: 123.45,
        description: '평균 응답 소요 시간 (ms).',
    })
    @Expose()
    @Type(() => Number)
    avgResponseTime: number;
}

export class GetTop5ElapsedTime {
    @ApiProperty({
        type: [ProjectElapsedTime],
        description: '프로젝트별 응답 속도 배열',
    })
    @Type(() => ProjectElapsedTime)
    projectSpeedRank: ProjectElapsedTime[];
}
