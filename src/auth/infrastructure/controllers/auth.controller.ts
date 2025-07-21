import { Body, Controller, Param, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dtos/LoginRequest.dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from 'src/auth/application/commands/Login/Login.commands';
import { ForgotPasswordRequestDto } from '../dtos/ForgotPaswordRequest.dto';
import { ForgotPasswordCommand } from 'src/auth/application/commands/ForgotPassword/ForgotPassword.command';


@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) { }

  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return this.commandBus.execute(new LoginCommand(loginRequestDto));
  }

  @Post('forgot-password/:uuid')
  async ForgotPassword(@Param('uuid') uuid: string, @Body() ForgotPasswordRequestDto: ForgotPasswordRequestDto) {
    return this.commandBus.execute(new ForgotPasswordCommand(uuid,ForgotPasswordRequestDto));
  }
}
