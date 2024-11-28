import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';
import { Expose, Type } from 'class-transformer';

export class DAURank {
    @IsString()
    projectName: string;

    @Type(() => Number)
    @IsNumber()
    value: number;
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
                value: 12345,
            },
            {
                projectName: 'test007',
                value: 234234,
            },
            {
                projectName: 'test079',
                value: 21212,
            },
        ],
    })
    @Expose()
    rank: DAURank[];
}
