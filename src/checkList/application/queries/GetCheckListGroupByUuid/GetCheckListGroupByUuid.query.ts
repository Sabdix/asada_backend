import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListGroupDto } from '../../dtos/CheckListGroup.dto';

export class GetCheckListGroupByUuidQuery extends Query<
  WsResponse<CheckListGroupDto | string>
> {
  constructor(public readonly uuid: string) {
    super();
  }
}
