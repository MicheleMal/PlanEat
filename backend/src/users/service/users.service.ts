import { ConflictException, Injectable } from "@nestjs/common";
import { CreateUserDto } from "../dto/create-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../entities/user.entity";

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) {}

    async createUser(createUserDto: CreateUserDto): Promise<User> {
        // Controllo se già presente l'email
        if (
            this.userRepository.findOne({
                where: {
                    email: createUserDto.email,
                },
            })
        ) {
            throw new ConflictException("Email già registrata");
        }

        const user = this.userRepository.create(createUserDto);

        console.log(user);

        return this.userRepository.save(user);
    }

    async findByEmail(email: string): Promise<User | null> {
        return this.userRepository.findOne({
            where: {
                email: email,
            },
        });
    }
}
