import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as crypto from 'crypto';
import { ForgotPasswordCommand } from './ForgotPassword.command';
import { UserService } from 'src/user/application/services/user.service';
import { ConfigService } from '@nestjs/config';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(
    private userService: UserService,
    private readonly configService: ConfigService
  ) { }

  async execute(command: ForgotPasswordCommand): Promise<WsResponse<null | string>> {

    const user = await this.userService.getUserByMailAndPhone(command.body)
    if (!user) return WsResponse.buildNotFoundResponse('USER NOT FOUND');

    var defaultPassword = this.configService.get<string>('DEFAULT_PASSWORD') ?? "T12345678w"

    user.password = crypto.createHash('sha256').update(defaultPassword).digest('hex'),
      user.change_password = true;
    await this.userService.UpdateUser(user);

    return WsResponse.buildOkResponse(null);
  }
}
