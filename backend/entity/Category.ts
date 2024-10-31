import {
    Entity, 
    PrimaryGeneratedColumn, 
    Column, OneToMany, 
    Relation 
} from 'typeorm';
import { Task } from './Task';

@Entity()
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Task, (task) => task.category)
    tasks: Relation<Task[]>
}
