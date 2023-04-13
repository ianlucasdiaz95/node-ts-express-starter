import { QueryRoleDto } from '@/dto';
import { Service } from "typedi"
import { Role } from "@/entities"
import { dataSource } from "@/db/connection";
import { NotFoundError } from 'routing-controllers';
import { Repository } from 'typeorm';

@Service()
export class RoleService {

    private readonly roleRepository: Repository<Role>;

    constructor() {
        this.roleRepository = dataSource.getRepository(Role);
    }

    async getRoles(query: QueryRoleDto) {
        const { ...where } = query;

        const data = await this.roleRepository.find({
            where
        })

        //If theres no data
        if(data.length === 0){
            throw new NotFoundError('No data found')
        }

        return {
            data: data,
        }
    }

    async getRole(id: number) {

        const data = await this.roleRepository.findOne({
            where: {
                id
            }
        });

        if(!data){
            throw new NotFoundError('No data found')
        }

        return data
    }

    async createRole(role: Role) {

        if (role.isDefault) {
            await this.updateDefaultRoleConstraint();
        }
        

        return await this.roleRepository.save(role);

    }

    async editRole(id: number, role: Role) {

        if(role.isDefault){
            await this.updateDefaultRoleConstraint();
        }

        await this.roleRepository.update(id, { ...role });

        return await this.getRole(id);

    }

    async deleteRole(id: number) {

        const { affected } = await this.roleRepository.delete(id);

        if(affected === 0){
            throw new NotFoundError(`Register with id: ${id} was not found`);
        }

        return `Register with id: ${id} deleted`
    }

    async getDefaultRole(){
        return await this.roleRepository.findOne({
            where: {
                isDefault: true
            }
        })
    }

    async updateDefaultRoleConstraint(){
        await this.roleRepository.update(
            { isDefault: true },
            { isDefault: false }
        );
    }
}