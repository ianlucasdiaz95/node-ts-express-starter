import { Entity, Column, ManyToOne, JoinColumn, BeforeInsert, BeforeUpdate, Repository } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';
import { genSaltSync, hashSync } from 'bcrypt';
import { dataSource } from '../db/connection';
import { RoleService } from '../services';


@Entity()
export class User extends BaseEntity {

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    name: string;

    @Column( { select: false })
    password: string;

    @Column({ nullable: true, default: 'USER' })
    role: string;

    /* TODO: delete this statement, just an example on how to create relations
    @ManyToOne(() => Role, role => role.users)
    @JoinColumn()
    role: Role;

    @Column({default: 1})
    roleId: number;
    */

    @BeforeInsert()
    @BeforeUpdate()
    hashPassword() {
        if (this.password) {
            this.password = hashSync(this.password, genSaltSync());
        }
    }
}