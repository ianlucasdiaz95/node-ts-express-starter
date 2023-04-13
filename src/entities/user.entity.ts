import { Entity, Column, BeforeInsert, BeforeUpdate } from 'typeorm';
import { BaseEntity } from './base.entity';
import { genSaltSync, hashSync } from 'bcrypt';
import { Roles } from '@/interfaces';


@Entity()
export class User extends BaseEntity {

    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    name: string;

    @Column()
    password: string;

    @Column({ nullable: true, default: Roles.USER })
    role: Roles;

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