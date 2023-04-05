import { IsString, IsEmail, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class QueryUserDto {
    page?: number
    per_page?: number
    id?: number
    name?: string
    email?: string
    roleId?: number
}

type QueryUserWhere = Omit<QueryUserDto, 'page' | 'per_page'>;

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNumber()
    @IsOptional()
    roleId?: number;
}

export class UpdateUserDto {
    @IsEmail()
    @IsOptional()
    email?: string;

    @IsString()
    @IsOptional()
    name?: string;

    @IsString()
    @IsOptional()
    password?: string;

    @IsNumber()
    @IsOptional()
    roleId?: number;
}