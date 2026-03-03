import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListGroupDto } from '../../dtos/CheckListGroup.dto';

export class GetCheckListGroupsQuery extends Query<
  WsResponse<CheckListGroupDto[] | string>
> {
  constructor(public readonly name?: string) {
    super();
  }
}
