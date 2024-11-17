import {IsDate, IsNumber, Matches} from "class-validator";

export class UpdateRunningRecordDto {
    @IsNumber()
    distance: number;

    @Matches(/^\d{2}:\d{2}:\d{2}$/, { message: 'Workout time must be in HH:mm:ss format' })
    workoutTime: string;

    @IsDate()
    date: Date;
}
