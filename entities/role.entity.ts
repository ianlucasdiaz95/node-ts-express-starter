import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { User } from './user.entity';


@Entity()
export class Role extends BaseEntity {
    @Column({ unique: true })
    name: string;

    @Column({ default: false })
    isDefault: boolean;

    @OneToMany(() => User, user => user.role)
    users: User[];
}