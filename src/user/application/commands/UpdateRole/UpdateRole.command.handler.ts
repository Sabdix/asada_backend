import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { RoleDto } from '../../dtos/Role.dto';
import { RoleService } from '../../services/role.service';
import { UpdateRoleCommand } from './UpdateRole.command';

@CommandHandler(UpdateRoleCommand)
export class UpdateRoleCommandHandler implements ICommandHandler<UpdateRoleCommand> {
    constructor(
        private roleService: RoleService,
    ) { }

    async execute(command: UpdateRoleCommand): Promise<WsResponse<RoleDto | string>> {

        const role = await this.roleService.getRoleByUuid(command.uuid);
        if (!role)
            return WsResponse.buildNotFoundResponse('ROLE NOT FOUND');

        role.name = command.body.name;
        await this.roleService.updateRole(role);

        return WsResponse.buildOkResponse(
            plainToInstance(RoleDto, role, { excludeExtraneousValues: true }),
        );
    }
}
