import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteUserCommand } from './DeleteUser.command';
import { UserService } from '../../services/user.service';

@CommandHandler(DeleteUserCommand)
export class DeleteUserCommandHandler
    implements ICommandHandler<DeleteUserCommand> {
    constructor(private readonly userService: UserService) { }

    async execute(
        command: DeleteUserCommand,
    ): Promise<WsResponse<null | string>> {
        const user = await this.userService.getUserByUuid(
            command.uuid,
        );

        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        await this.userService.deleteUser(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
