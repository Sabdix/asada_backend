import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserService } from '../../services/user.service';
import { ChangePasswordCommand } from './ChangePassword.command';
import * as crypto from 'crypto';

@CommandHandler(ChangePasswordCommand)
export class ChangePasswordCommandHandler implements ICommandHandler<ChangePasswordCommand> {
  constructor(
    private userService: UserService
  ) {}

  async execute(command: ChangePasswordCommand): Promise<WsResponse<null | string>> {

    const user = await this.userService.getUserByUuidAndPassword(command.request, command.uuid)
    if (!user) return WsResponse.buildBadPasswordResponse('USER NOT FOUND');

    user.password = crypto.createHash('sha256').update(command.request.newPassword).digest('hex'),
    user.change_password = false;
    await this.userService.UpdateUser(user);

    return WsResponse.buildOkResponse(null);
  }
}
