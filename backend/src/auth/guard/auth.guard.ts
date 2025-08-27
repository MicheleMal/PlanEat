import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private jwtService: JwtService) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const token = this.extractTokenFromHeader(req);

        if (!token) {
            throw new UnauthorizedException("Token invalido");
        }

        try {
            const payload = await this.jwtService.verifyAsync(token, {
                secret: process.env.JWT_SECRET,
            });

            req["user"] = payload;
        } catch (error) {
            throw new UnauthorizedException("Token invalido");
        }

        return true;
    }

    private extractTokenFromHeader(req: Request): string | undefined {
        const authHeader = req.headers["authorization"];
        const token = authHeader && authHeader.split(" ")[1];

        return token;
    }
}
