import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsBoolean } from 'class-validator';

export class ExistsProjectResponseDto {
    @ApiProperty({
        example: true,
    })
    @IsBoolean()
    @Expose()
    exists: boolean;
}
