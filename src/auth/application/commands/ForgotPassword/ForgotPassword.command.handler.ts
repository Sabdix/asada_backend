import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as crypto from 'crypto';
import { ForgotPasswordCommand } from './ForgotPassword.command';
import { UserService } from 'src/user/application/services/user.service';

@CommandHandler(ForgotPasswordCommand)
export class ForgotPasswordCommandHandler implements ICommandHandler<ForgotPasswordCommand> {
  constructor(
    private userService: UserService
  ) {}

  async execute(command: ForgotPasswordCommand): Promise<WsResponse<null | string>> {

    const user = await this.userService.getUserByUuidMailAndPhone(command.body, command.uuid)
    if (!user) return WsResponse.buildBadPasswordResponse('USER NOT FOUND');

    user.password = crypto.createHash('sha256').update(command.body.password).digest('hex'),
    user.change_password = false;
    await this.userService.UpdateUser(user);

    return WsResponse.buildOkResponse(null);
  }
}
