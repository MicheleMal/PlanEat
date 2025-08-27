import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    @MinLength(8, {
        message: "min length is 8",
    })
    password: string;

    @IsString()
    @IsNotEmpty()
    name: string;
}
