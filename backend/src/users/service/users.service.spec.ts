import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "./users.service";
import { getRepositoryToken } from "@nestjs/typeorm";
import { User } from "../entities/user.entity";
import { ConflictException } from "@nestjs/common";
import * as bcrypt from "bcrypt";

describe("UsersService", () => {
    let service: UsersService;

    const mockUserRepository = {
        findOne: jest.fn(),
        create: jest.fn(),
        save: jest.fn(),
        delete: jest.fn(),
        update: jest.fn(),
    };

    const createUserDto = {
        email: "test@gmail.com",
        name: "Mario",
        password: "password",
    };

    const fakeUser = {
        id: 1,
        ...createUserDto,
    };

    const fakeRequest = {
        user: {
            userId: 1,
        },
    } as unknown as Request;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: mockUserRepository,
                },
            ],
        }).compile();

        service = module.get<UsersService>(UsersService);

        jest.clearAllMocks();
    });

    describe("createUser", () => {
        it("should create successfully user and save in the database", async () => {
            const fakeNewUser = { ...createUserDto };
            const fakeSavedUser = { id: 1, ...createUserDto };

            mockUserRepository.findOne.mockResolvedValue(null);
            mockUserRepository.create.mockReturnValue(fakeNewUser);
            mockUserRepository.save.mockResolvedValue(fakeSavedUser);

            const result = await service.createUser(createUserDto);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: [
                    { email: createUserDto.email },
                    { name: createUserDto.name },
                ],
            });

            expect(mockUserRepository.create).toHaveBeenCalledWith(
                createUserDto,
            );
            expect(mockUserRepository.save).toHaveBeenCalledWith(fakeNewUser);

            expect(result).toEqual(fakeSavedUser);
        });

        it("should find the user and return conflict exception", async () => {
            mockUserRepository.findOne.mockResolvedValue(fakeUser);

            await expect(service.createUser(createUserDto)).rejects.toThrow(
                ConflictException,
            );

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: [
                    { email: createUserDto.email },
                    { name: createUserDto.name },
                ],
            });

            expect(mockUserRepository.create).not.toHaveBeenCalled();
            expect(mockUserRepository.save).not.toHaveBeenCalled();
        });
    });

    describe("findByEmail", () => {
        it("should find user and return email", async () => {
            mockUserRepository.findOne.mockResolvedValue(fakeUser);

            const result = await service.findByEmail(fakeUser.email);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email: fakeUser.email },
            });

            expect(result).toEqual(fakeUser);
        });

        it("should not find user and return null", async () => {
            mockUserRepository.findOne.mockResolvedValue(null);

            const result = await service.findByEmail(fakeUser.email);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: { email: fakeUser.email },
            });

            expect(result).toBeNull();
        });
    });

    describe("getProfile", () => {
        it("should return the logged in user information", async () => {
            mockUserRepository.findOne.mockResolvedValue({
                email: fakeUser.email,
                name: fakeUser.name,
                createdAt: "2026-01-01",
                updateAt: "2026-01-01",
            });

            const result = await service.getProfile(fakeRequest);

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
                select: ["email", "name", "createdAt", "updateAt"],
            });

            expect(result).toEqual({
                email: fakeUser.email,
                name: fakeUser.name,
                createdAt: "2026-01-01",
                updateAt: "2026-01-01",
            });
        });
    });

    describe("updateProfile", () => {
        it("should hash password and update profile when password is provided", async () => {
            const updateUserDto = {
                name: "Michele",
                password: "test123",
            };

            const originalPassword = updateUserDto.password;

            mockUserRepository.update.mockResolvedValue({ affected: 1 });

            jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPw");

            mockUserRepository.findOne.mockResolvedValue({
                email: fakeUser.email,
                name: fakeUser.name,
                createdAt: "2026-01-01",
                updateAt: "2026-01-01",
            });

            const result = await service.updateProfile(
                fakeRequest,
                updateUserDto,
            );

            expect(bcrypt.hash).toHaveBeenCalledWith(originalPassword, 10);

            expect(mockUserRepository.update).toHaveBeenCalledWith(
                fakeRequest["user"].userId,
                {
                    name: "Michele",
                    password: "hashedPw",
                },
            );

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
                select: ["email", "name", "createdAt", "updateAt"],
            });

            expect(result).toEqual({
                email: fakeUser.email,
                name: fakeUser.name,
                createdAt: "2026-01-01",
                updateAt: "2026-01-01",
            });
        });

        it("should update profile without hashing when password is not provided", async () => {
            const updateUserDto = {
                name: "Michele",
            };

            mockUserRepository.update.mockResolvedValue({ affected: 1 });

            mockUserRepository.findOne.mockResolvedValue({
                email: fakeUser.email,
                name: fakeUser.name,
                createdAt: "2026-01-01",
                updateAt: "2026-01-01",
            });

            const result = await service.updateProfile(
                fakeRequest,
                updateUserDto,
            );

            expect(mockUserRepository.update).toHaveBeenCalledWith(
                fakeRequest["user"].userId,
                {
                    name: "Michele",
                },
            );

            expect(bcrypt.hash).not.toHaveBeenCalled();

            expect(mockUserRepository.findOne).toHaveBeenCalledWith({
                where: {
                    id: 1,
                },
                select: ["email", "name", "createdAt", "updateAt"],
            });

            expect(result).toEqual({
                email: fakeUser.email,
                name: fakeUser.name,
                createdAt: "2026-01-01",
                updateAt: "2026-01-01",
            });
        });
    });

    describe("deleteProfile", () => {
        it("should deleted profile the user logged", async () => {
            mockUserRepository.delete.mockReturnValue({ affected: 1 });

            const result = await service.deleteProfile(fakeRequest);

            expect(mockUserRepository.delete).toHaveBeenCalledWith(1);

            expect(result).toBe(true);
        });
    });
});
