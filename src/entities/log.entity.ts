import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';


@Entity()
export class Log extends BaseEntity {
    @Column()
    message: string;

    @Column()
    level: string;
}