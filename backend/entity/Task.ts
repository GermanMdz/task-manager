import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
    Relation,
} from "typeorm"
import { User } from "./User"
import { Category } from "./Category"

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    title: string

    @Column('boolean', { default: false })
    isCompleted: boolean

    @Column()
    date: Date

    @ManyToOne(() => User, (user) => user.tasks, {
        cascade: true
    })
    user: Relation<User>

    @ManyToOne(() => Category, (category) => category.tasks, {
        cascade: true
    })
    category: Relation<Category>
}