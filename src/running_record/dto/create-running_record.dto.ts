import {IsDate, IsNumber, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateRunningRecordDto {
    @ApiProperty()
    @IsNumber()
    distance: number;

    @IsNumber()
    userId: number;

    @ApiProperty()
    @Matches(/^\d{2}:\d{2}:\d{2}$/, { message: 'workoutTime must be in HH:mm:ss format' })
    workoutTime: string;

    @ApiProperty()
    @IsDate()
    date: Date;
}
