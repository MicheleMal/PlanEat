import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";
import { UpdateUserDto } from "../dto/update-user.dto";
import * as bcrypt from "bcrypt";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    // Crea e salva l'utente nel database
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // Controllo se già presente email o name
        const user = await this.userRepository.findOne({
            where: [
                { email: createUserDto.email },
                { name: createUserDto.name },
            ],
        });
        if (user) {
            if (user.email == createUserDto.email) {
                throw new ConflictException("Email già registrata");
            } else if (user.name == createUserDto.name) {
                throw new ConflictException("Name già registrata");
            }
        }

        const newUser = this.userRepository.create(createUserDto);

        return await this.userRepository.save(newUser);
    }

    // Restituisce l'utente se esiste l'email, altrimenti null
    async findByEmail(email: string): Promise<User | null> {
        return await this.userRepository.findOne({
            where: {
                email: email,
            },
        });
    }

    // Restituisce dati utente loggato
    async getProfile(req: Request): Promise<User> {
        const { userId } = req["user"];

        const user = await this.userRepository.findOne({
            where: {
                id: userId,
            },
            select: ["email", "name", "createdAt", "updateAt"],
        });

        return user;
    }

    // Aggiornare informazioni utente (name, email, password)
    async updateProfile(
        req: Request,
        updateUserDto: UpdateUserDto
    ): Promise<Omit<User, "password">> {
        const { userId } = req["user"];

        if (updateUserDto.password) {
            const hashedPw = await bcrypt.hash(updateUserDto.password, 10);
            updateUserDto.password = hashedPw;
        }

        await this.userRepository.update(userId, updateUserDto);

        const user = await this.userRepository.findOne({
            where: { id: userId },
            select: ["email", "name", "createdAt", "updateAt"],
        });

        return user;
    }

    // Eliminare utente definitivamente
    async deleteProfile(req: Request): Promise<boolean> {
        const { userId } = req["user"];

        await this.userRepository.delete(userId);

        return true;
    }
}
