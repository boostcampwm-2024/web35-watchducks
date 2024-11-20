import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class GetDAUByProjectResponseDto {
    @ApiProperty({
        example: 'my-project',
        description: '프로젝트 이름',
    })
    @Expose()
    projectName: string;

    @ApiProperty({
        example: '2023-10-01',
        description: '조회한 날짜',
    })
    @Expose()
    date: string;

    @ApiProperty({
        example: 12345,
        description: '해당 날짜의 DAU 값',
    })
    @Expose()
    @Type(() => Number)
    dau: number;
}
