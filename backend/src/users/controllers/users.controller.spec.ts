import { Test, TestingModule } from "@nestjs/testing";
import { UsersController } from "./users.controller";
import { UsersService } from "../service/users.service";
import { AuthGuard } from "src/auth/guard/auth.guard";

describe("UsersController", () => {
    let controller: UsersController;

    const mockUsersService = {
        getProfile: jest.fn(),
        updateProfile: jest.fn(),
        deleteProfile: jest.fn()
    };

    const fakeRequest = {
        user: {
            userId: 1,
        },
    } as unknown as Request;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [
                {
                    provide: UsersService,
                    useValue: mockUsersService,
                },
            ],
        })
            .overrideGuard(AuthGuard)
            .useValue({
                canActivate: jest.fn(() => true),
            })
            .compile();

        controller = module.get<UsersController>(UsersController);
    });

    it("should call service get user profile", async () => {
        const fakeUser = {
            email: "test@test.com",
            name: "Mario",
            createdAt: "2025-09.10",
            updateAt: "2025-09.10",
        };

        mockUsersService.getProfile.mockResolvedValue(fakeUser);

        const result = await controller.getProfile(fakeRequest);

        expect(mockUsersService.getProfile).toHaveBeenCalledWith(fakeRequest);

        expect(result).toEqual(fakeUser);
    });

    it("should call service to update profile", async ()=>{
      const updateUserDto = {
        name: "Michele"
      }

      const updatedUser = {
        email: "test@test.com",
        name: "Michele",
        createdAt: "2025-09.10",
        updayeAt: "2026-02.22",
      }

      mockUsersService.updateProfile.mockResolvedValue(updateUserDto)

      const result = await controller.updateProfile(fakeRequest, updateUserDto)

      expect(mockUsersService.updateProfile).toHaveBeenCalledWith(fakeRequest, updateUserDto)

      expect(result).toEqual(updateUserDto)
    })

    it("should call service to delete profile", async ()=>{

      mockUsersService.deleteProfile.mockResolvedValue(true)

      const result = await controller.deleteProfile(fakeRequest)

      expect(mockUsersService.deleteProfile).toHaveBeenCalledWith(fakeRequest)

      expect(result).toBe(true)
    })
});
