import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteRoleCommand } from './DeleteRole.command';
import { RoleService } from '../../services/role.service';

@CommandHandler(DeleteRoleCommand)
export class DeleteRoleCommandHandler
    implements ICommandHandler<DeleteRoleCommand> {
    constructor(private readonly roleService: RoleService) { }

    async execute(
        command: DeleteRoleCommand,
    ): Promise<WsResponse<null | string>> {
        const role = await this.roleService.getRoleByUuid(
            command.uuid,
        );

        if (!role)
            return WsResponse.buildNotFoundResponse('ROLE NOT FOUND');

        await this.roleService.deleteRole(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
