import { Roles } from '@/interfaces';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class QueryRoleDto {
    name?: Roles
    isDefault?: boolean
}

export class CreateRoleDto {
    @IsNotEmpty()
    @IsString()
    name: Roles;

    @IsOptional()
    @IsBoolean()
    isDefault: boolean;
}

export class UpdateRoleDto {
    @IsOptional()
    @IsString()
    name: Roles;

    @IsOptional()
    @IsBoolean()
    isDefault: boolean;
}