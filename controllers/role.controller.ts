import { Service } from 'typedi';
import { RoleService } from './../services';
import { JsonController, Post, Get, Put, Delete, Body, Param, QueryParams  } from 'routing-controllers';
import { CreateRoleDto, QueryRoleDto, UpdateRoleDto } from '../dto';
import { Role } from '../entities';
import { EntityMapper } from '../clients';

@JsonController('/role')
@Service()
export class RoleController {

    constructor(private roleService: RoleService){}

    @Post()
    async post(@Body() roleDTO: CreateRoleDto) {

        const role: Role = EntityMapper.mapTo(Role, roleDTO);

        const result = await this.roleService.createRole(role);
        
        return { 
            success: true, 
            data: result 
        };

    }

    @Get()
    async getAll(@QueryParams() query: QueryRoleDto) {

        const result = await this.roleService.getRoles(query);

        return {
            success: true,
            ...result
        };
    }

    @Get('/:id')
    async get(@Param('id') id: number) { 

        const result = await this.roleService.getRole(id)

        return {
            success: true,
            data: result
        };
    }

    @Put('/:id')
    async update(@Param('id') id: number, @Body() roleDTO: UpdateRoleDto) {

        const role: Role = EntityMapper.mapTo(Role, roleDTO);

        const result = await this.roleService.editRole(id, role)

        return {
            success: true,
            data: result
        };
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        const result = await this.roleService.deleteRole(id)

        return {
            success: true,
            data: result
        };
    }
}