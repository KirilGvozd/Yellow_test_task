import {IsDate, IsNumber, Matches} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class CreateRunningRecordDto {

    @ApiProperty({
        description: "The distance of the run",
        minimum: 0,
        default: 1,
    })
    @IsNumber()
    distance: number;

    @IsNumber()
    userId: number;

    @ApiProperty({
        description: "The time of the workout",
        default: "00:01:00",
    })
    @Matches(/^\d{2}:\d{2}:\d{2}$/, { message: 'workoutTime must be in HH:mm:ss format' })
    workoutTime: string;

    @ApiProperty({
        description: "The date of the workout",
        default: getCurrentDate(),
    })
    @IsDate()
    date: Date;

}

function getCurrentDate(): string {
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()}-${now.getDate()}`
}