import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RoleDto } from '../../dtos/Role.dto';
import { RoleService } from '../../services/role.service';
import { plainToInstance } from 'class-transformer';
import { GetRoleByUuidQuery } from './GetRoleByUuid.query';

@QueryHandler(GetRoleByUuidQuery)
export class GetRoleByUuidQueryHandler implements IQueryHandler<GetRoleByUuidQuery> {
  constructor(private  roleService: RoleService) {}

  async execute(query: GetRoleByUuidQuery) {
    const role = await this.roleService.getRoleByUuid(query.uuid);

    if (!role) return WsResponse.buildNotFoundResponse('ROLE NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(RoleDto, role, { excludeExtraneousValues: true }),
    );
  }
}
