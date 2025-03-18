import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { UpdateCheckListItemRequestDto } from '../../dtos/UpdateCheckListItemRequest.dto';


export class UpdateCheckListItemCommand extends Command<WsResponse<CheckListItemDto | string>> {
    constructor(public readonly body: UpdateCheckListItemRequestDto, public readonly uuid: string) {
        super();
    }
}
