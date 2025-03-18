import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateCheckListItemRequestDto } from '../../dtos/CreateCheckListItemRequest.dto';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';


export class CreateCheckListItemCommand extends Command<WsResponse< CheckListItemDto | string>> {
  constructor(public body: CreateCheckListItemRequestDto) {
    super();
  }
}
