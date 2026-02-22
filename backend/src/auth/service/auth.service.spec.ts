import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import * as bcrypt from "bcrypt";
import { UsersService } from "src/users/service/users.service";
import { JwtService } from "@nestjs/jwt";
import { UnauthorizedException } from "@nestjs/common";

describe("AuthService", () => {
    let service: AuthService;

    const mockUsersService = {
        findByEmail: jest.fn(),
        createUser: jest.fn(),
    };

    const mockJwtService = {
        signAsync: jest.fn(),
    };

    const fakeUser = {
        id: 1,
        name: "Mario",
        email: "test@mail.com",
        password: "password",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                { provide: UsersService, useValue: mockUsersService },
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        jest.clearAllMocks();

        service = module.get<AuthService>(AuthService);
    });

    describe("signup", () => {
        const registerDto = {
            email: "test@gmail.com",
            password: "password",
            name: "Mario",
        };

        // Registrazione effettuata con successo (nuovo utente)
        it("should register successfully and return user without password", async () => {
            jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPw");

            mockUsersService.createUser.mockResolvedValue({
                id: fakeUser.id,
                email: fakeUser.email,
                name: fakeUser.name,
            });

            const result = await service.signup(registerDto);

            expect(bcrypt.hash).toHaveBeenCalledWith(registerDto.password, 10);

            expect(mockUsersService.createUser).toHaveBeenCalledWith({
                ...registerDto,
                password: "hashedPw",
            });

            expect(result).toEqual({
                id: fakeUser.id,
                email: fakeUser.email,
                name: fakeUser.name,
            });

            expect(mockJwtService.signAsync).not.toHaveBeenCalled();
        });
    });

    describe("signin", () => {
        const loginDto = {
            email: "test@mail.com",
            password: "password",
        };

        // 1. utente non trovato, email non corretta
        it("should throw if email does not exist", async () => {
            mockUsersService.findByEmail.mockResolvedValue(null);

            jest.spyOn(bcrypt, "compare");

            expect(service.signin(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
            expect(bcrypt.compare).not.toHaveBeenCalled();
            expect(mockJwtService.signAsync).not.toHaveBeenCalled();
        });

        // 2. Password errata
        it("should thrwo password incorrect", async () => {
            mockUsersService.findByEmail.mockResolvedValue(fakeUser);

            jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

            await expect(service.signin(loginDto)).rejects.toThrow(
                UnauthorizedException,
            );
            expect(bcrypt.compare).toHaveBeenCalledWith(
                loginDto.password,
                fakeUser.password,
            );
            expect(mockJwtService.signAsync).not.toHaveBeenCalled();
        });

        // 3. login effettuato con successo (return token)
        it("should login successfully and return access token", async () => {
            mockUsersService.findByEmail.mockResolvedValue(fakeUser);

            jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

            mockJwtService.signAsync.mockResolvedValue("fake-jwt-token");

            const result = await service.signin(loginDto);

            expect(result).toEqual({ access_token: "fake-jwt-token" });

            expect(mockUsersService.findByEmail).toHaveBeenCalledWith(
                loginDto.email,
            );

            expect(bcrypt.compare).toHaveBeenCalledWith(
                loginDto.password,
                fakeUser.password,
            );

            expect(mockJwtService.signAsync).toHaveBeenCalledWith(
                {
                    userId: fakeUser.id,
                    email: fakeUser.email,
                },
                expect.any(Object),
            );
        });
    });
});
