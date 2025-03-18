import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteCheckListItemCriteriaCommand } from './DeleteCheckListItemCriteria.command';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';

@CommandHandler(DeleteCheckListItemCriteriaCommand)
export class DeleteCheckListItemCriteriaCommandHandler
    implements ICommandHandler<DeleteCheckListItemCriteriaCommand> {
    constructor(private readonly checkListItemCriteriaService: CheckListItemCriteriaService) { }

    async execute(command: DeleteCheckListItemCriteriaCommand): Promise<WsResponse<null | string>> {
        const checkListItemCriteria = await this.checkListItemCriteriaService.getCheckListItemCriteriaByUuid(
            command.uuid,
        );

        if (!checkListItemCriteria)
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM_CRITERIA NOT FOUND');

        await this.checkListItemCriteriaService.deleteCheckListItemCriteria(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
