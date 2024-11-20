import { IsNotEmpty, IsString, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetDAUByProjectDto {
    @ApiProperty({
        example: 'watchducks',
        description: '프로젝트 이름',
    })
    @IsNotEmpty()
    @IsString()
    projectName: string;

    @ApiProperty({
        example: '2023-10-01',
        description: '조회할 날짜 (YYYY-MM-DD 형식)',
    })
    @IsNotEmpty()
    @IsDateString()
    date: string;
}
