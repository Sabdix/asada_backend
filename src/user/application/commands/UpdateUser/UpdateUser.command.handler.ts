import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { RoleDto } from '../../dtos/Role.dto';
import { RoleService } from '../../services/role.service';
import { UpdateUserCommand } from './UpdateUser.command';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';
import { BranchService } from 'src/branch/application/services/Branch.service';

@CommandHandler(UpdateUserCommand)
export class updateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private branchService: BranchService
    ) { }

    async execute(command: UpdateUserCommand): Promise<WsResponse<UserDto | string>> {

        const user = await this.userService.getUserByUuid(command.uuid);
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        user.name = command.body.name ?? user.name;
        user.last_name = command.body.last_name ?? user.last_name;
        user.second_last_name = command.body.second_last_name ?? user.second_last_name;
        user.phone = command.body.phone ?? user.phone;
        user.uuid_branch = command.body.uuid_branch ?? user.uuid_branch;
        user.uuid_role = command.body.uuid_role ?? user.uuid_role;

        const role = await this.roleService.getRoleByUuid(user.uuid_role);
        if (!role)
            return WsResponse.buildNotFoundResponse('ROLE NOT FOUND');

        user.role = role;
        const branch = await this.branchService.getBranchByUuid(user.uuid_branch);
        if (!branch)
            return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');
        user.branch = branch;

        await this.userService.UpdateUser(user);

        return WsResponse.buildOkResponse(
            plainToInstance(UserDto, user, { excludeExtraneousValues: true }),
        );
    }
}
