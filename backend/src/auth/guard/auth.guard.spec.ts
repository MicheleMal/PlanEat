import { Test, TestingModule } from "@nestjs/testing";
import { AuthGuard } from "./auth.guard";
import { JwtService } from "@nestjs/jwt";
import { ExecutionContext, UnauthorizedException } from "@nestjs/common";

describe("AuthGuard", () => {
    let guard: AuthGuard;
    let jwtService: JwtService;

    const mockJwtService = {
        verifyAsync: jest.fn(),
    };

    const mockExecutionContext = (request: any): ExecutionContext =>
        ({
            switchToHttp: () => ({
                getRequest: () => request,
            }),
        }) as ExecutionContext;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthGuard,
                { provide: JwtService, useValue: mockJwtService },
            ],
        }).compile();

        guard = module.get<AuthGuard>(AuthGuard);
        jwtService = module.get<JwtService>(JwtService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it("should throw if no token", async () => {
        const req = { headers: {} };
        const context = mockExecutionContext(req);

        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });

    it("should validate token and attach user to request", async () => {
        const payload = { sub: 1, email: "test@test.com" };

        mockJwtService.verifyAsync.mockResolvedValue(payload);

        const req = {
            headers: { authorization: "Bearer validtoken" },
        };

        const context = mockExecutionContext(req);

        const result = await guard.canActivate(context);

        expect(result).toBe(true);
        expect(jwtService.verifyAsync).toHaveBeenCalledWith("validtoken", {
            secret: process.env.JWT_SECRET,
        });
        expect(req["user"]).toEqual(payload);
    });

    it("should throw if token invalid", async () => {
        mockJwtService.verifyAsync.mockRejectedValue(new Error());

        const req = {
            headers: { authorization: "Bearer invalidtoken" },
        };

        const context = mockExecutionContext(req);

        await expect(guard.canActivate(context)).rejects.toThrow(
            UnauthorizedException,
        );
    });
});
