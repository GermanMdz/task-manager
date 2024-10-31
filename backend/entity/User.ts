import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    OneToMany,
    Relation,
} from "typeorm"
import { Task } from "./Task"

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @OneToMany(() => Task, (task) => task.user) 
    tasks: Relation<Task[]>
}