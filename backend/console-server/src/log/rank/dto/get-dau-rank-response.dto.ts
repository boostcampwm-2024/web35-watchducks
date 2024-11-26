import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class DAURank {
    @IsString()
    projectName: string;

    @Type(() => Number)
    @IsNumber()
    dau: number;
}

export class GetDAURankResponseDto {
    @ApiProperty({
        description: '총 갯수',
        example: 30,
    })
    @IsNumber()
    total: number;

    @ApiProperty({
        description: 'dau 순위',
        example: [
            {
                projectName: 'test059',
                dau: 12345,
            },
            {
                projectName: 'test007',
                dau: 234234,
            },
            {
                projectName: 'test079',
                dau: 21212,
            },
        ],
    })
    @Expose()
    rank: DAURank[];
}
