import { Seeder, SeederFactoryManager } from 'typeorm-extension'; 
import { DataSource } from 'typeorm';
import { User } from '../../entities';
import { genSaltSync, hashSync } from 'bcrypt';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        const userRepository = dataSource.getRepository(User);
        await userRepository.insert([
            {
                email: 'admin@admin.com',
                name: 'admin',
                password: hashSync('admin', genSaltSync()),
                role: 'ADMIN'
            }
        ]);
    }
}