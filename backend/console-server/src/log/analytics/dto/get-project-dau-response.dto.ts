import { Exclude, Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DauRecord {
    @ApiProperty({
        example: '2023-10-01',
        description: '해당하는 날짜',
    })
    @Expose()
    @Type(() => String)
    date: string;

    @ApiProperty({
        example: 12345,
        description: '해당 날짜의 DAU 값',
    })
    @Expose()
    @Type(() => Number)
    dau: number = 0;
}

@Exclude()
export class GetProjectDauResponseDto {
    @ApiProperty({
        example: 'my-project',
        description: '프로젝트 이름',
    })
    @Expose()
    projectName: string;

    @ApiProperty({
        type: [DauRecord],
        description: '최근 30일간의 날짜와 DAU 값',
    })
    @Expose()
    @Type(() => DauRecord)
    dauRecords: DauRecord[];
}
