import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetPathElapsedTimeRank {
    @IsNotEmpty()
    @IsString()
    @ApiProperty({
        description: '프로젝트명',
        example: 'watchducks',
        required: true,
    })
    projectName: string;
}
