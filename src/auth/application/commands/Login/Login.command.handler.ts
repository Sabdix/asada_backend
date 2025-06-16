import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { AuthService } from '../../services/auth.service';
import { LoginResponseDto } from 'src/auth/infrastructure/dtos/LoginResponse.dto';
import { LoginCommand } from './Login.commands';
import { UserService } from 'src/user/application/services/user.service';
import { plainToInstance } from 'class-transformer';

@CommandHandler(LoginCommand)
export class LoginCommandHandler implements ICommandHandler<LoginCommand> {
  constructor(
    private authService: AuthService,
    private userService: UserService,
  ) { }

  async execute(command: LoginCommand): Promise<WsResponse<LoginResponseDto /*UserDto*/ | string>> {

    const user = await this.userService.getUserByMailAndPassword(command.loginRequestDto)
    if (!user) return WsResponse.buildBadCredentialsResponse();

    //const payload = { user };
    const payload = { uuid: user.uuid, mail: user.mail, uuidRole: user.uuid_role }
    const accessToken = await this.authService.generateAccessToken(payload);
    const refreshToken = await this.authService.generateRefreshToken(
      payload,
      'secret'
    );
    const response = new LoginResponseDto()
    response.userData = user
    response.accessToken = accessToken
    response.refreshToken = refreshToken
    response.change_password = user.change_password
    
    return WsResponse.buildOkResponse(
      plainToInstance(LoginResponseDto, response, { excludeExtraneousValues: true }));

    // return WsResponse.buildOkResponse(
    //   new LoginResponseDto(accessToken, refreshToken, user),
    // );
  }
}
