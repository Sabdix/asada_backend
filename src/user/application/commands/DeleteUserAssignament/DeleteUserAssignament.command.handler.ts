import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteUserAssignamentCommand } from './DeleteUserAssignament.command';
import { CheckListUserService } from 'src/checkList/application/services/checkListUser.service';

@CommandHandler(DeleteUserAssignamentCommand)
export class DeleteUserAssignamentCommandHandler
  implements ICommandHandler<DeleteUserAssignamentCommand>
{
  constructor(private readonly checkListUserService: CheckListUserService) {}

  async execute(
    command: DeleteUserAssignamentCommand,
  ): Promise<WsResponse<null | string>> {
    const userAssignament =
      await this.checkListUserService.getUserCheckListByUuid(command.uuid);

    if (!userAssignament)
      return WsResponse.buildNotFoundResponse('CHECKLIST_USER NOT FOUND');

    await this.checkListUserService.deleteCheckListUser(command.uuid);

    return WsResponse.buildOkResponse(null);
  }
}
