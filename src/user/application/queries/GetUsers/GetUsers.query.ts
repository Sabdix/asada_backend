import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from '../../dtos/User.dto';

export class GetUsersQuery extends Query<WsResponse<UserDto[] | string>> {
  constructor(
    public readonly size: number,
    public readonly offset: number,
    public readonly name: string,
    public readonly lastName: string,
    public readonly secondLastName: string,
    public readonly role: string,
    public readonly branch: string
  ) {
    super();
  }
}
