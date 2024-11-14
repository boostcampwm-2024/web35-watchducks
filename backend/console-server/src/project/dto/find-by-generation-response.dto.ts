import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';

export class FindByGenerationResponseDto {
    @ApiProperty({
        example: 'watchducks',
    })
    @IsNotEmpty()
    @Expose()
    @Transform(({ obj }) => obj.name)
    value: string;
}
