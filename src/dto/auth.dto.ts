import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class LoginAuthDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}

export class RefreshAuthDto {
    @IsNotEmpty()
    token: string
}