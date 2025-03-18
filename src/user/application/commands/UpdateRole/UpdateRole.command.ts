import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RoleDto } from '../../dtos/Role.dto';
import { UpdateRoleRequestDto } from '../../dtos/UpdateRole.Request.dto';


export class UpdateRoleCommand extends Command<WsResponse<RoleDto | string>> {
  constructor(public body: UpdateRoleRequestDto, public uuid: string
  ) {
    super();
  }
}
