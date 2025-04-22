import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class GetBranchQrByUuidQuery extends Query<WsResponse<string | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
