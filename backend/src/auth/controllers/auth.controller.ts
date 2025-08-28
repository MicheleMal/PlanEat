import { Body, Controller, Post, ValidationPipe } from "@nestjs/common";
import { AuthService } from "../service/auth.service";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { LoginDto } from "../dto/login.dto";

@Controller("auth")
export class AuthController {
    constructor(private readonly authService: AuthService) {}

    @Post("signup")
    async signup(@Body(ValidationPipe) createUserDto: CreateUserDto) {
        return this.authService.signup(createUserDto);
    }

    @Post("signin")
    async signin(@Body(ValidationPipe) loginDto: LoginDto) {
        return this.authService.signin(loginDto);
    }
}
