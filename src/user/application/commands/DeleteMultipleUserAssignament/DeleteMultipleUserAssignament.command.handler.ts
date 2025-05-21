import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserService } from 'src/checkList/application/services/checkListUser.service';
import { DeleteMultipleUserAssignamentCommand } from './DeleteMultipleUserAssignament.command';

@CommandHandler(DeleteMultipleUserAssignamentCommand)
export class DeleteMultipleUserAssignamentCommandHandler
    implements ICommandHandler<DeleteMultipleUserAssignamentCommand> {
    constructor(private readonly checkListUserService: CheckListUserService) { }

    async execute(
        command: DeleteMultipleUserAssignamentCommand,
    ): Promise<WsResponse<null | string>> {

        for (const assignament of command.request.uuid) {

            const userAssignament = await this.checkListUserService.getUserCheckListByUuid(
                assignament,
            );

            if (!userAssignament)
                return WsResponse.buildNotFoundResponse('CHECKLIST_USER NOT FOUND');

            await this.checkListUserService.deleteCheckListUser(assignament);
        }


        return WsResponse.buildOkResponse(null);
    }
}
