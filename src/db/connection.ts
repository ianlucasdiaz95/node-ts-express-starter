import { DB_HOST, DB_PORT, DB_USERNAME, DB_PASSWORD, DB_DATABASE } from '../config'
import { Log, Role, User } from '../entities';
import { DataSource, DataSourceOptions } from "typeorm"
import { SeederOptions } from 'typeorm-extension';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

const options: DataSourceOptions & SeederOptions = {
    type: "mysql",
    host: DB_HOST,
    port: parseInt(DB_PORT),
    username: DB_USERNAME,
    password: DB_PASSWORD,
    database: DB_DATABASE,
    entities: [
        User,
        Role,
        Log
    ],
    logging: false,
    synchronize: true,
    namingStrategy: new SnakeNamingStrategy(),
    seeds: ['db/seeds/**/*{.ts,.js}'],
    factories: ['db/factories/**/*{.ts,.js}']
}

export const dataSource = new DataSource(options)