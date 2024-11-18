import { IsNotEmpty, IsString } from 'class-validator';

export class GetPathSpeedRankDto {
    @IsNotEmpty()
    @IsString()
    projectName: string;
}
