import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { AuthService } from '../../services/auth.service';
import { LoginResponseDto } from 'src/auth/infrastructure/dtos/LoginResponse.dto';
import { LoginCommand } from './Login.commands';
import { UserService } from 'src/user/application/services/user.service';
import { LoginRequestDto } from 'src/auth/infrastructure/dtos/LoginRequest.dto';
import { plainToInstance } from 'class-transformer';
import { UserDto } from 'src/user/application/dtos/User.dto';
import { User } from 'src/user/domain/entities/User.entity';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) {}

  async execute(command: LoginCommand): Promise<WsResponse<LoginResponseDto /*UserDto*/ | string>> {

    
    const user = await this.userService.getUserByMailAndPassword(command.loginRequestDto)
    if (!user) return WsResponse.buildNotFoundResponse('USER NOT FOUND');

    //const payload = { user };
    const payload = { uuid : user.uuid, mail : user.mail, uuidRole: user.uuid_role}
    const accessToken = await this.authService.generateAccessToken(payload);
    const refreshToken = await this.authService.generateRefreshToken(
      payload,
      'secret'
    );
    
    // return WsResponse.buildOkResponse(
    //   plainToInstance(UserDto, user, { excludeExtraneousValues: true }),|

    return WsResponse.buildOkResponse(
      new LoginResponseDto(accessToken, refreshToken, user),
    );
  }
}
