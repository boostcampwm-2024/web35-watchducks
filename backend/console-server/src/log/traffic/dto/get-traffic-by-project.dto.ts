import { IsNotEmpty, IsString, IsIn } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';

export class GetTrafficByProjectDto {
    @ApiProperty({
        example: 'watchducks',
        description: '프로젝트 이름',
    })
    @IsNotEmpty()
    @IsString()
    projectName: string;

    @ApiProperty({
        example: 'hour',
        description: '시간 단위 (Minute, Hour, Day, Week, Month)',
        enum: ['Minute', 'Hour', 'Day', 'Week', 'Month'],
    })
    @IsNotEmpty()
    @IsString()
    @Transform(({ value }) => {
        if (typeof value === 'string') {
            const lower = value.toLowerCase();
            return lower.charAt(0).toUpperCase() + lower.slice(1);
        }
        return value;
    })
    @IsIn(['Minute', 'Hour', 'Day', 'Week', 'Month'])
    timeUnit: string;
}
