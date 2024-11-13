import { IsNotEmpty } from 'class-validator';

export class FindByGenerationResponseDto {
    @IsNotEmpty()
    name: string;
}
