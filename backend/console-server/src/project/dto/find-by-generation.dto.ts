import { IsNotEmpty, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindByGenerationDto {
    @IsNotEmpty()
    @Transform(({ value }) => Number(value))
    @IsNumber()
    generation: number;
}
