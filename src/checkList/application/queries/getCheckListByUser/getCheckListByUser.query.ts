import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';

export class GetCheckListByUserQuery extends Query<WsResponse<CheckListUserDto[] | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
