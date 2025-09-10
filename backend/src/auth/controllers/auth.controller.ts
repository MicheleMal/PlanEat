import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { LoginDto } from "../dto/login.dto";
import {
    ApiBody,
    ApiConflictResponse,
    ApiCreatedResponse,
    ApiOkResponse,
    ApiOperation,
    ApiUnauthorizedResponse,
} from "@nestjs/swagger";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @ApiOperation({
        summary: "Registrazione nuovo utente",
    })
    @ApiBody({ type: CreateUserDto })
    @ApiConflictResponse({
        description: "Email o password già registrate",
    })
    @ApiCreatedResponse({
        description: "Registrazione avvenuta con successo",
    })
    @Post("signup")
    async signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

    @ApiOperation({
        summary: "Login utente",
    })
    @ApiBody({ type: LoginDto })
    @ApiUnauthorizedResponse({
        description: "Credenziali invalide",
    })
    @ApiOkResponse({
        description: "Login effettuato con successo",
        schema: {
            example: {
                access_token: "12345buksms....",
            },
        },
    })
    @Post("signin")
    async signin(@Body(ValidationPipe) loginDto: LoginDto) {
        return this.authService.signin(loginDto);
    }
}
