import { IsEmail, IsIP, IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    name: string;

    @IsIP()
    @IsNotEmpty()
    ip: string;

    @IsString()
    @IsNotEmpty()
    domain: string;

    @IsEmail()
    @IsNotEmpty()
    email: string;
}
