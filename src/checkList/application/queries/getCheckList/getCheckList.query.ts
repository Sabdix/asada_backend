import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';

export class GetCheckListQuery extends Query<WsResponse<CheckListDto[] | string>> {
  constructor(
    public readonly size: number,
    public readonly offset: number
  ) {
    super();
  }
}
