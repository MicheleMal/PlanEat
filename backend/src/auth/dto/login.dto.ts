import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class LoginDto {
    @ApiProperty({
        type: "string",
        name: "email",
        description: "Email utilizzata durante la registrazione",
        example: "mario.rossi@prova.it"
    })
    @IsEmail()
    @IsNotEmpty()
    email: string;

    @ApiProperty({
        type: "string",
        name: "password",
        description: "Password utilizzata durante la registrazione",
        minimum: 8,
        example: "12345678"
    })
    @IsNotEmpty()
    @MinLength(8, {
        message: "Lunghezza minima 8",
    })
    password: string;
}
