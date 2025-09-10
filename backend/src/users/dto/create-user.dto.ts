import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({
        type: "string",
        name: "email",
        description: "Email personale",
        example: "mario.rossi@prova.it"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: "string",
        name: "password",
        example: "12345678"
    })
    @IsNotEmpty()
    @MinLength(8, {
        message: "Lunghezza minima 8",
    })
    password: string;

    @ApiProperty({
        type: "string",
        name: "name",
        description: "Nome utente",
        example: "MarioRossi"
    })
    @IsString()
    @IsNotEmpty()
    name: string;
}
