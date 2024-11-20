import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetSuccessRateByProjectDto {
    @IsString()
    @ApiProperty({
        description: '프로젝트 이름',
        example: 'watchducks',
        required: true,
    })
    projectName: string;
}
