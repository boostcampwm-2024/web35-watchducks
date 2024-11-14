import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FindByGenerationResponseDto {
    @ApiProperty({
        example: 'watchducks',
    })
    @IsNotEmpty()
    name: string;
}
