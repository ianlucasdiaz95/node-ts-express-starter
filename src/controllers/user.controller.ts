import { Service } from 'typedi';
import { UserService } from './../services';
import { JsonController, Post, Get, Put, Delete, Body, Param, QueryParams  } from 'routing-controllers';
import { CreateUserDto, QueryUserDto, UpdateUserDto } from '@/dto';
import { User } from '@/entities';
import { EntityMapper } from '@/clients';
@JsonController('/user')
@Service()
export class UserController {

    constructor(private userService: UserService){}

    @Post('/')
    async post(@Body() userDTO: CreateUserDto) {

        const user: User = EntityMapper.mapTo(User, userDTO);

        const result = await this.userService.createUser(user);
        
        return { 
            success: true, 
            data: result 
        };

    }

    @Get('/')
    async getAll(@QueryParams() query: QueryUserDto) {

        const result = await this.userService.getUsers(query);

        return {
            success: true,
            ...result
        };
    }

    @Get('/:id')
    async get(@Param('id') id: number) { 

        const result = await this.userService.getUser(id)

        return {
            success: true,
            data: result
        };
    }

    @Put('/:id')
    async update(@Param('id') id: number, @Body() userDTO: UpdateUserDto) {

        const user: User = EntityMapper.mapTo(User, userDTO);

        const result = await this.userService.editUser(id, user)

        return {
            success: true,
            data: result
        };
    }

    @Delete('/:id')
    async delete(@Param('id') id: number) {
        const result = await this.userService.deleteUser(id)

        return {
            success: true,
            data: result
        };
    }
}