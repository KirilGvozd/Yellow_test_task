import {IsEmail, IsString} from "class-validator";
import {ApiProperty} from "@nestjs/swagger";

export class LoginUserDto {
    @ApiProperty({
        description: "Your email address",
        default: "example@example.com",
    })
    @IsEmail()
    email: string;

    @ApiProperty({
        description: "Your password",
        default: "password",
    })
    @IsString()
    password: string;
}