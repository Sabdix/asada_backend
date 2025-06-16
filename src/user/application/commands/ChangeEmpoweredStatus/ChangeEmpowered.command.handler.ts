import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserService } from '../../services/user.service';
import { ChangeEmpoweredStatusCommand} from './ChangeEmpoweredStatus.command';

@CommandHandler(ChangeEmpoweredStatusCommand)
export class ChangeEmpoweredStatusCommandHandler
    implements ICommandHandler<ChangeEmpoweredStatusCommand> {
    constructor(private readonly userService: UserService) { }

    async execute(command: ChangeEmpoweredStatusCommand,  ): Promise<WsResponse<null | string>> {
        
        const user = await this.userService.getUserByUuid(
            command.uuid,
        );

        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        user.empowered = !user.empowered;

        await this.userService.UpdateUser(user);

        return WsResponse.buildOkResponse(null);
    }
}
