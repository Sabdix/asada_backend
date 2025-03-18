import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RoleDto } from '../../dtos/Role.dto';
import { CreateRoleRequestDto } from '../../dtos/CreateRoleRequest.dto';


export class CreateRoleCommand extends Command<WsResponse< RoleDto | string>> {
  constructor(public body: CreateRoleRequestDto) {
    super();
  }
}
