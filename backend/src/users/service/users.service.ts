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
        private readonly userRepository: Repository<User>,
    ) {}

    // Crea e salva l'utente nel database
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        try {
            const newUser = this.userRepository.create(createUserDto);

            return await this.userRepository.save(newUser);
        } catch (error) {
            if (error.errno === 1062) {
                throw new ConflictException("Utente già registrato");
            }

            throw error;
        }
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
            select: ["email", "name", "createdAt", "updatedAt"],
        });

        return user;
    }

    // Aggiornare informazioni utente (name, email, password)
    async updateProfile(
        req: Request,
        updateUserDto: UpdateUserDto,
    ): Promise<Omit<User, "password">> {
        const { userId } = req["user"];

        try {
            if (updateUserDto.password) {
                const hashedPw = await bcrypt.hash(updateUserDto.password, 10);
                updateUserDto.password = hashedPw;
            }

            await this.userRepository.update(userId, updateUserDto);

            const user = await this.userRepository.findOne({
                where: { id: userId },
                select: ["email", "name", "createdAt", "updatedAt"],
            });

            return user;
        } catch (error) {
            if (error.errno === 1062) {
                if(error.sqlMessage.includes("UQ_USER_NAME")){
                    throw new ConflictException("Nome già utilizzato");
                }

                if(error.sqlMessage.includes("UQ_USER_EMAIL")){
                    throw new ConflictException("Email già utilizzata");
                }
                
            }

            throw error;
        }
    }

    // Eliminare utente definitivamente
    async deleteProfile(req: Request): Promise<boolean> {
        const { userId } = req["user"];

        await this.userRepository.delete(userId);

        return true;
    }
}
