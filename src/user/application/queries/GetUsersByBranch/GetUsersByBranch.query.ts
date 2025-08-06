import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { RoleDto } from '../../dtos/Role.dto';
import { UserDto } from '../../dtos/User.dto';

export class GetUsersByBranchQuery extends Query<WsResponse<UserDto[] | string>> {
  constructor(public readonly uuid: string,
    public readonly size: number,
    public readonly offset: number,
    public readonly name: string,
    public readonly lastName: string,
    public readonly secondLastName: string,
    public readonly role: string,) {
    super();
  }
}
