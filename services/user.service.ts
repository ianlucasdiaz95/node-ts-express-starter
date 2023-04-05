import { QueryUserDto } from './../dto';
import { Service } from "typedi"
import { genSaltSync, hashSync } from 'bcrypt';
import { User } from "../entities"
import { dataSource } from "../db/connection";
import { HttpError, NotFoundError } from 'routing-controllers';
import { Repository } from 'typeorm';

@Service()
export class UserService {

    private readonly userRepository: Repository<User>;

    constructor() {
        this.userRepository = dataSource.getRepository(User);
    }

    async getUsers(query: QueryUserDto) {
        const { page, per_page, ...where } = query;

        const skip = page && per_page ? (+page - 1) * +per_page : undefined;
        const take = per_page ? +per_page  : undefined;

        const data = await this.userRepository.findAndCount({
            where,
            skip,
            take,
        })

        //If theres no data
        if(data[0].length === 0){
            throw new NotFoundError('No data found')
        }

        return {
            data: data[0],
            total: data[1],
            page: +page || 1,
            per_page: +per_page || data[1]
        }
    }

    async getUser(id: number) {

        const data = await this.userRepository.findOne({
            where: {
                id
            }
        });

        if(!data){
            throw new NotFoundError('No data found')
        }

        return data
    }

    async createUser(user: User) {

        user.password = this.hashPassword(user.password);

        return await this.userRepository.save(user);

    }

    async editUser(id: number, user: User) {

        if(user.password){
            user.password = this.hashPassword(user.password);
        }

        await this.userRepository.update(id, { ...user });

        return await this.getUser(id);

    }

    async deleteUser(id: number) {

        const { affected } = await this.userRepository.delete(id);

        if(affected === 0){
            throw new NotFoundError(`Register with id: ${id} was not found`);
        }

        return `Register with id: ${id} deleted`
    }

    hashPassword(password: string): string {
        return hashSync(password, genSaltSync());
    }
}