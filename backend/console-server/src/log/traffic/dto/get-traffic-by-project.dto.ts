import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetTrafficByProjectDto {
    @ApiProperty({
        example: 'watchducks',
        description: '프로젝트 이름',
    })
    @IsNotEmpty()
    @IsString()
    projectName: string;

    @ApiProperty({
        example: '24hours',
        description: '데이터 범위 (24hours, 1week, 1month)',
        enum: ['24hours', '1week', '1month'],
    })
    @IsNotEmpty()
    @IsString()
    @IsIn(['24hours', '1week', '1month'])
    timeRange: string;
}
