import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { DuplicateItemRequestDto } from '../../dtos/DuplicateItemRequest.dto';


export class DuplicateItemCommand extends Command<WsResponse< CheckListItemDto | string>> {
  constructor(public body: DuplicateItemRequestDto) {
    super();
  }
}
