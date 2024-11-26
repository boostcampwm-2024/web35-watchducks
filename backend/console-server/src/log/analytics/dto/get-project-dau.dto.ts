import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDAUsByProjectDto {
    @ApiProperty({
        example: 'watchducks',
        description: '프로젝트 이름',
    })
    @IsNotEmpty()
    @IsString()
    projectName: string;
}
