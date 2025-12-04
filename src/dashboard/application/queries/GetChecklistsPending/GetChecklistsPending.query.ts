import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class GetChecklistsPendingQuery extends Query<WsResponse<any>> {
  constructor(public uuidBranch: string) {
    super();
  }
}
