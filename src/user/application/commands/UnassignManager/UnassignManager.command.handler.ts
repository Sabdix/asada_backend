import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';
import { UnassignManagerCommand } from './UnassignManager.command';
import { User } from 'src/user/domain/entities/User.entity';

@CommandHandler(UnassignManagerCommand)
export class UnassignManagerCommandHandler implements ICommandHandler<UnassignManagerCommand> {
    constructor(
        private userService: UserService,
    ) { }

    async execute(command: UnassignManagerCommand): Promise<WsResponse<UserDto | string>> {

        const user = await this.userService.getUserByUuid(command.uuid);
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        user.uuid_user = null
        user.manager = null
        await this.userService.UpdateUser(user);

        return WsResponse.buildOkResponse(
            plainToInstance(UserDto, user, { excludeExtraneousValues: true }));
        //return WsResponse.buildOkResponse(null);
    }
}
