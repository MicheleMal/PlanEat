import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "../../users/dto/create-user.dto";
import { UsersService } from "src/users/service/users.service";
import * as bcrypt from "bcrypt";
import { User } from "src/users/entities/user.entity";

@Injectable()
export class AuthService {
    constructor(private usersService: UsersService) {}

    // Signup - registrazione nuovo utente
    async signup(createUserDto: CreateUserDto): Promise<User> {
        const hashedPw = await bcrypt.hash(createUserDto.password, 10);

        const user = this.usersService.createUser({
            ...createUserDto,
            password: hashedPw,
        });

        return user;
    }

    // signin - login utente registrato
    async signin(){

    }

}
