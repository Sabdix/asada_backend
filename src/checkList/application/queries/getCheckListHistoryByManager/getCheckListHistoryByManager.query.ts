import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';

export class GetCheckListHistoryByManagerQuery extends Query<WsResponse< CheckListHistoryDto[] | string>> {
  constructor( 
    public readonly uuidCheckList: string,
    public readonly uuidManager: string
  ) {
    super();
  }
}
