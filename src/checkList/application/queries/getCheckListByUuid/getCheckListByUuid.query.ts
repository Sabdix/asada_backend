import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';

export class GetCheckListByUuidQuery extends Query<WsResponse<CheckListDto | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
