import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { AuthController } from "./infrastructure/controllers/auth.controller";
import { AuthService } from "./application/services/auth.service";
import { LoginCommandHandler } from "./application/commands/Login/Login.command.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { JwtModule } from "@nestjs/jwt";
import { UserService } from "src/user/application/services/user.service";
import { UserModule } from "src/user/User.module";
import { ForgotPasswordCommandHandler } from "./application/commands/ForgotPassword/ForgotPassword.command.handler";

@Module({ 
    imports:[
        ConfigModule.forRoot(),
        CqrsModule.forRoot(),
        UserModule,
        ConfigModule,
        JwtModule.register({
      global: true,
      secret: process.env.JWT_TOKEN,
      signOptions: { expiresIn: '1h' },
    }),
    ],
    providers : [LoginCommandHandler, AuthService, ForgotPasswordCommandHandler],
    controllers : [AuthController],
    
})
export class AuthModule{}
