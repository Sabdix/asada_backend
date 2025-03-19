import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { RoleDto } from '../../dtos/Role.dto';
import { RoleService } from '../../services/role.service';
import { AssignManagerCommand } from './AssignManager.command';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';

@CommandHandler(AssignManagerCommand)
export class AssignManagerCommandHandler implements ICommandHandler<AssignManagerCommand> {
    constructor(
        private userService: UserService,
    ) { }

    async execute(command: AssignManagerCommand): Promise<WsResponse<UserDto | string>> {

        if(command.uuid == command.body.uuid_manager)
            return WsResponse.buildConflictResponse('NO SE PUEDE ASIGARNAR AL MISMO USUARIO COMO JEFE','INVALID USER')

        const user = await this.userService.getUserByUuid(command.uuid);
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        const manager = await this.userService.getUserByUuid(command.body.uuid_manager);
        if (!manager)
            return WsResponse.buildNotFoundResponse('MANAGER NOT FOUND');

        user.uuid_user = manager.uuid
        user.manager = manager

        await this.userService.UpdateUser(user);

        return WsResponse.buildOkResponse(
              plainToInstance(UserDto, user, { excludeExtraneousValues: true }));
        //return WsResponse.buildOkResponse(null);
    }
}
