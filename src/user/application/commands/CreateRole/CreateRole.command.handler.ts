import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CreateRoleCommand } from './CreateRole.command';
import { RoleDto } from '../../dtos/Role.dto';
import { RoleService } from '../../services/role.service';

@CommandHandler(CreateRoleCommand)
export class CreateRoleCommandHandler implements ICommandHandler<CreateRoleCommand> {
  constructor(
    private roleService: RoleService,
  ) {}

  async execute(command: CreateRoleCommand): Promise<WsResponse<RoleDto | string>> {

    if (await this.roleService.getRoleByName(command.body.name))
        return WsResponse.buildConflictResponse('YA EXISTE UN ROL CON ESE NOMBRE','ROLE ALREADY EXISTS');

    const role = await this.roleService.creteRole(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(RoleDto, role, { excludeExtraneousValues: true }),
    );
  }
}
