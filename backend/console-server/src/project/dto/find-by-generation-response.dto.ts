import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class FindByGenerationResponseDto {
    @ApiProperty({
        example: 'watchducks',
    })
    @IsNotEmpty()
    @Expose()
    value: string;
}
