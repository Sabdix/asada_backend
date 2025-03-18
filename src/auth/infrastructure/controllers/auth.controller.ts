import { Body, Controller, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dtos/LoginRequest.dto';
import { CommandBus } from '@nestjs/cqrs';
import { LoginCommand } from 'src/auth/application/commands/Login/Login.commands';


@Controller('auth')
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('login')
  async login(@Body() loginRequestDto: LoginRequestDto) {
    return this.commandBus.execute(new LoginCommand(loginRequestDto));
  }
}
