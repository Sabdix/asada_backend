import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';

export class GetAssignedCheckListQuery extends Query<WsResponse<CheckListUserDto[] | string>> {
  constructor(
    public readonly size: number,
    public readonly offset: number
  ) {
    super();
  }
}
