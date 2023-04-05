import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Role } from './role.entity';


@Entity()
export class User extends BaseEntity {
    @Column({ unique: true })
    email: string;

    @Column({ nullable: true })
    name: string;

    @Column( { select: false })
    password: string;

    @ManyToOne(() => Role, role => role.users)
    @JoinColumn()
    role: Role;

    @Column({default: 1})
    roleId: number;
}