import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListItemCriteriaAnswerDto } from '../../dtos/CheckListItemCriteriaAnswer.dto';
import { UpdateCheckListItemCriteriaAnswerRequestDto } from '../../dtos/UpdateCheckListItemCriteriaAnswerRequest.dto';


export class UpdateCheckListItemCriteriaAnswerCommand extends Command<WsResponse<CheckListItemCriteriaAnswerDto | string>> {
    constructor(public readonly body: UpdateCheckListItemCriteriaAnswerRequestDto, public readonly uuid: string) {
        super();
    }
}
