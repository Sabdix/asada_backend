import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';

export class GetCheckListQrByUuidQuery extends Query<WsResponse<string | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
