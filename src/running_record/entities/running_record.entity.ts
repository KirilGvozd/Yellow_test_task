import {Column, Entity, PrimaryGeneratedColumn} from "typeorm";

@Entity()
export class RunningRecord {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    distance: number;

    @Column('time')
    workoutTime: string;

    @Column()
    date: Date;
}