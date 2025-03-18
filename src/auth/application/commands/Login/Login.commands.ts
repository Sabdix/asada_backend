import { Command } from '@nestjs/cqrs';
import { LoginRequestDto } from 'src/auth/infrastructure/dtos/LoginRequest.dto';
import { LoginResponseDto } from 'src/auth/infrastructure/dtos/LoginResponse.dto';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from 'src/user/application/dtos/User.dto';


export class LoginCommand extends Command<WsResponse<LoginResponseDto /*UserDto*/ | string>> {
  constructor(public readonly loginRequestDto: LoginRequestDto) {
    super();
  }
}
