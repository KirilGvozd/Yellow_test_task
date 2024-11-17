import {IsDate, IsNumber, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class UpdateRunningRecordDto {
    @ApiProperty()
    @IsNumber()
    distance: number;

    @ApiProperty()
    @Matches(/^\d{2}:\d{2}:\d{2}$/, { message: 'Workout time must be in HH:mm:ss format' })
    workoutTime: string;

    @ApiProperty()
    @IsDate()
    date: Date;
}
