import { IsNotEmpty } from 'class-validator';

export class FindByGenerationDto {
    @IsNotEmpty()
    generation: number;
}
