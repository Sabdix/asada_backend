import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';

export class GetCheckListItemsByCheckListQuery extends Query<WsResponse<CheckListItemDto[]| string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
