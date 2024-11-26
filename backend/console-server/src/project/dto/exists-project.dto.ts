import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ExistsProjectDto {
    @IsString()
    @ApiProperty({
        example: 'watchducks',
        description: '유효성 검사할 프로젝트 명',
    })
    projectName: string;
}
