import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserDto } from 'src/checkList/application/dtos/CheckListUser.dto';

export class GetAssignedCheckListQuery extends Query<WsResponse<CheckListUserDto[] | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
