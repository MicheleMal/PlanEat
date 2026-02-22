import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller";
import { AuthService } from "../service/auth.service";

describe("AuthController", () => {
    let controller: AuthController;

    const mockAuthService = {
        signup: jest.fn(),
        signin: jest.fn(),
    };

    const fakeUser = {
        email: "test@test.com",
        name: "Mario",
        createdAt: "2025-09.10",
        updateAt: "2025-09.10",
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [{ provide: AuthService, useValue: mockAuthService }],
        }).compile();

        controller = module.get<AuthController>(AuthController);
    });

    it("should call service to register new user", async () => {
        const createUserDto = {
            email: "test@test.com",
            name: "Mario",
            password: "test",
        };

        mockAuthService.signup.mockResolvedValue(fakeUser);

        const result = await controller.signup(createUserDto);

        expect(mockAuthService.signup).toHaveBeenCalledWith(createUserDto);

        expect(result).toEqual(fakeUser);
    });

    it("should call service to login", async () => {
        const loginDto = {
            email: "test@test.com",
            password: "test",
        };

        mockAuthService.signin.mockResolvedValue({
            access_token: "fake-jwt-token",
        });

        const result = await controller.signin(loginDto);

        expect(mockAuthService.signin).toHaveBeenCalledWith(loginDto);

        expect(result).toEqual({
            access_token: "fake-jwt-token",
        });
    });
});
