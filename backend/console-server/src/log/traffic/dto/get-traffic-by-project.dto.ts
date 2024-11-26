import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { TIME_RANGE, TimeRange } from '../traffic.constant';

export class GetTrafficByProjectDto {
    @ApiProperty({
        example: 'watchducks',
        description: '프로젝트 이름',
    })
    @IsNotEmpty()
    @IsString()
    projectName: string;

    @ApiProperty({
        example: 'day',
        description: '데이터 범위 (day, week, month)',
        enum: Object.values(TIME_RANGE),
    })
    @IsNotEmpty()
    timeRange: TimeRange;
}
