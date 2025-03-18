import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteCheckListItemCriteriaAnswerCommand } from './DeleteCheckListItemCriteriaAnswer.command';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';

@CommandHandler(DeleteCheckListItemCriteriaAnswerCommand)
export class DeleteCheckListItemCriteriaAnswerCommandHandler
    implements ICommandHandler<DeleteCheckListItemCriteriaAnswerCommand> {
    constructor(private readonly checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService) { }

    async execute(command: DeleteCheckListItemCriteriaAnswerCommand): Promise<WsResponse<null | string>> {
        const checkListItemCriteriaAnswer = await this.checkListItemCriteriaAnswerService.getCheckListItemCriteriaAnswerByUuid(
            command.uuid,
        );

        if (!checkListItemCriteriaAnswer)
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM_CRITERIA_ANSWER NOT FOUND');

        await this.checkListItemCriteriaAnswerService.deleteCheckListItemCriteriaAnswer(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
