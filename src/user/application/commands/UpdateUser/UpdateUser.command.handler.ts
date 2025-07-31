import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { RoleDto } from '../../dtos/Role.dto';
import { RoleService } from '../../services/role.service';
import { UpdateUserCommand } from './UpdateUser.command';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { WorkAreaService } from '../../services/workArea.service';

@CommandHandler(UpdateUserCommand)
export class UpdateUserCommandHandler implements ICommandHandler<UpdateUserCommand> {
    constructor(
        private userService: UserService,
        private roleService: RoleService,
        private branchService: BranchService,
        private workAreaService: WorkAreaService
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
        user.uuid_work_area = command.body.uuid_work_area

        const role = await this.roleService.getRoleByUuid(user.uuid_role);
        if (!role)
            return WsResponse.buildNotFoundResponse('ROLE NOT FOUND');

        user.role = role;

        if (Number(role.hierarchy) == 4) {
            const hierarchy = (Number(role.hierarchy) - 1).toString()

            const superiorRole = await this.roleService.getRoleByHierarchy(hierarchy, role.uuid_work_area)

            const manager = await this.userService.GetUserByBranchAndRole(user.uuid_branch, superiorRole?.uuid)

            user.manager = manager
            await this.userService.UpdateUser(user)
        } else if (Number(role.hierarchy) == 3) {

            const superiorRole = await this.roleService.getRoleByName("Gerente Sucursal")

            const manager = await this.userService.GetUserByBranchAndRole(user.uuid_branch, superiorRole?.uuid)

            user.manager = manager
            await this.userService.UpdateUser(user)
        }

        const branch = await this.branchService.getBranchByUuid(user.uuid_branch);
        if (!branch)
            return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');
        user.branch = branch;

        if (user.uuid_work_area != null) {
            const workArea = await this.workAreaService.getWorkAreaByUuid(user.uuid_work_area);
            if (!workArea)
                return WsResponse.buildNotFoundResponse('WORK_AREA NOT FOUND');
            user.workArea = workArea;
        } else {
            user.workArea = null
        }

        await this.userService.UpdateUser(user);

        return WsResponse.buildOkResponse(
            plainToInstance(UserDto, user, { excludeExtraneousValues: true }),
        );
    }
}
