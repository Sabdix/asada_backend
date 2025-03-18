import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RoleDto } from '../../dtos/Role.dto';

export class GetRolesQuery extends Query<WsResponse<RoleDto[] | string>> {
  constructor() {
    super();
  }
}
