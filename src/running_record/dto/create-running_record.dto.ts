import {IsDate, IsDecimal, IsNumber, Matches} from "class-validator";

export class CreateRunningRecordDto {
    @IsNumber()
    distance: number;

    @IsNumber()
    userId: number;

    @Matches(/^\d{2}:\d{2}:\d{2}$/, { message: 'workoutTime must be in HH:mm:ss format' })
    workoutTime: string;

    @IsDate()
    date: Date;
}
