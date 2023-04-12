import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class Role extends BaseEntity {

    @Column({ unique: true })
    name: string;

    @Column({ default: false })
    isDefault: boolean;

    /* TODO: delete this statement, just an example on how to create relations
    
    @OneToMany(() => User, user => user.role)
    users: User[];
    */
}