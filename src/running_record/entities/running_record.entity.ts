import {Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn} from "typeorm";
import {User} from "../../auth/entities/user.entity";

@Entity()
export class RunningRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;

    @Column("decimal")
    distance: number;

    @Column('time')
    workoutTime: string;

    @Column()
    date: Date;

    @ManyToOne(() => User, (user) => user.id)
    @JoinColumn({name: 'userId'})
    user: User;
}