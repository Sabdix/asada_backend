import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';
import { UpdateCheckListItemRequestDto } from '../../dtos/UpdateCheckListItemRequest.dto';
import { UpdateCheckListItemCriteriaRequestDto } from '../../dtos/UpdateCheckListItemCriteriaRequest.dto';


export class UpdateCheckListItemCriteriaCommand extends Command<WsResponse<CheckListItemCriteriaDto | string>> {
    constructor(public readonly body: UpdateCheckListItemCriteriaRequestDto, public readonly uuid: string) {
        super();
    }
}
