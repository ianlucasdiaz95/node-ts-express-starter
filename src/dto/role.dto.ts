import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class QueryRoleDto {
    name?: string
    isDefault?: boolean
}

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsOptional()
    @IsBoolean()
    isDefault: boolean;
}

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name: string;

    @IsOptional()
    @IsBoolean()
    isDefault: boolean;
}