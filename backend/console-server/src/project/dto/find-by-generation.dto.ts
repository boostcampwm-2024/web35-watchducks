import { IsNotEmpty, IsNumber } from 'class-validator';
import { Type } from 'class-transformer';

export class FindByGenerationDto {
    @IsNotEmpty()
    @Type(() => Number)
    @IsNumber()
    generation: number;
}
