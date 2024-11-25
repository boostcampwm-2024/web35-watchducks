import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetProjectSuccessRateResponseDto {
    @ApiProperty({
        description: '프로젝트의 이름',
        example: 'watchducks',
    })
    @Expose()
    projectName: string;
    @ApiProperty({
        description: '프로젝트의 응답 성공률',
        example: 85.5,
    })
    @Expose()
    @Type(() => Number)
    success_rate: number;
}
