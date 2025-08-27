import { Module } from "@nestjs/common";
import { AuthService } from "./service/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { UsersModule } from "src/users/users.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        JwtModule.register({
            global: true,
            secret: process.env.JWT_SECRET,
            /*signOptions: {
        expiresIn: "60s"
      }*/
        }),
        UsersModule,
    ],
    providers: [AuthService],
    controllers: [AuthController],
})
export class AuthModule {}
