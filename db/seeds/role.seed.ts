import { Seeder, SeederFactoryManager } from 'typeorm-extension'; 
import { DataSource } from 'typeorm';
import { Role } from '../../entities';

export default class UserSeeder implements Seeder {
    public async run(
        dataSource: DataSource,
    ): Promise<any> {
        const roleRepository = dataSource.getRepository(Role);
        await roleRepository.insert([
            {
                name: 'ADMIN',
            },
            {
                name: 'USER',
                isDefault: true
            }
        ]);
    }
}