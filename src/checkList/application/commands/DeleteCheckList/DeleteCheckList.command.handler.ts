import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteCheckListCommand } from './DeleteCheckList.command';
import { CheckListService } from '../../services/checkList.service';

@CommandHandler(DeleteCheckListCommand)
export class DeleteCheckListCommandHandler
    implements ICommandHandler<DeleteCheckListCommand> {
    constructor(private readonly checkListService: CheckListService) { }

    async execute(command: DeleteCheckListCommand): Promise<WsResponse<null | string>> {
        const checkList = await this.checkListService.getCheckListByUuid(
            command.uuid,
        );

        if (!checkList)
            return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

        await this.checkListService.deleteCheckList(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
