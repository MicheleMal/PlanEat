import { Injectable, UnauthorizedException } from "@nestjs/common";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UsersService } from "src/users/service/users.service";
import * as bcrypt from "bcrypt";
import { User } from "src/users/entities/user.entity";
import { LoginDto } from "../dto/login.dto";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) {}

    // Signup - registrazione nuovo utente
    async signup(createUserDto: CreateUserDto): Promise<Omit<User, "password">> {
        const hashedPw = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.usersService.createUser({
            ...createUserDto,
            password: hashedPw,
        });

        return user;
    }

    // signin - login utente registrato
    async signin(loginDto: LoginDto): Promise<{ access_token: string }> {
        const user = await this.usersService.findByEmail(loginDto.email);

        if (!user) {
            throw new UnauthorizedException("Credenziali invalide");
        }

        const isPwValid = await bcrypt.compare(
            loginDto.password,
            user.password
        );

        if (!isPwValid) {
            throw new UnauthorizedException("Credenziali invalide");
        }

        const payload = { userId: user.id, email: user.email };

        const accessToken = await this.jwtService.signAsync(payload, {
            secret: process.env.JWT_SECRET
        });

        return {
            access_token: accessToken,
        };
    }
}
