import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class GetCheckListHistoryByUserAndGroupQuery extends Query<
  WsResponse<any | string>
> {
  constructor(
    public readonly uuidUser: string,
    public readonly uuidGroup: string,
  ) {
    super();
  }
}
