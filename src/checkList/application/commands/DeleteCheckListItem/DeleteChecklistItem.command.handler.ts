import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteCheckListItemCommand } from './DeleteCheckListItem.command';
import { CheckListItemService } from '../../services/checkListItem.service';

@CommandHandler(DeleteCheckListItemCommand)
export class DeleteCheckListItemCommandHandler
    implements ICommandHandler<DeleteCheckListItemCommand> {
    constructor(private readonly checkListItemService: CheckListItemService) { }

    async execute(command: DeleteCheckListItemCommand): Promise<WsResponse<null | string>> {
        const checkListItem = await this.checkListItemService.getCheckListItemByUuid(
            command.uuid,
        );

        if (!checkListItem)
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM NOT FOUND');

        await this.checkListItemService.deleteCheckListItem(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
