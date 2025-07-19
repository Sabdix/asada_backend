import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from '../../dtos/User.dto';

export class GetUsersQuery extends Query<WsResponse<UserDto[] | string>> {
  constructor(
    public readonly size:number, 
    public readonly offset:number
  ) {
    super();
  }
}
