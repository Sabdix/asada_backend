import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RoleDto } from '../../dtos/Role.dto';
import { RoleService } from '../../services/role.service';
import { plainToInstance } from 'class-transformer';
import { GetRolesQuery } from './GetRoles.query';

@QueryHandler(GetRolesQuery)
export class GetRolesQueryHandler implements IQueryHandler<GetRolesQuery> {
  constructor(private  roleService: RoleService) {}

  async execute(): Promise<WsResponse<RoleDto[]>> {
    const roles = await this.roleService.getRoles();

    return WsResponse.buildOkResponse(
      plainToInstance(RoleDto, roles, { excludeExtraneousValues: true }),
    );
  }
}
