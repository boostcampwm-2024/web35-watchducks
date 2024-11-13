import { IsEmail, IsIP, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProjectDto {
    @ApiProperty({
        example: 'watchducks',
        description: '프로젝트 명',
    })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({
        example: '123.123.78.90',
        description: '프로젝트 IP (0.0.0.0 ~ 255.255.255.255 사이의 값이어야 합니다)',
    })
    @IsIP()
    @IsNotEmpty()
    ip: string;

    @ApiProperty({
        example: 'www.watchdukcs.com',
        description: '프로젝트 도메인 네임',
    })
    @IsString()
    @IsNotEmpty()
    domain: string;

    @ApiProperty({
        example: 'watchducks@gmail.com',
        description: '프로젝트 소유자 이메일',
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        example: 9,
        description: '부스트캠프 기수',
    })
    @IsNumber()
    @IsNotEmpty()
    generation: number;
}
