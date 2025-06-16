import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';

export class GetCheckListHistoryByBranchQuery extends Query<WsResponse<CheckListHistoryDto[] | string>> {
  constructor( public readonly uuid: string) {
    super();
  }
}
