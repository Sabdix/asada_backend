import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteUserAssignamentChecklistCommand } from './DeleteUserAssignamentChecklist.command';
import { CheckListUserService } from 'src/checkList/application/services/checkListUser.service';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

@CommandHandler(DeleteUserAssignamentChecklistCommand)
export class DeleteUserAssignamentChecklistCommandHandler
  implements ICommandHandler<DeleteUserAssignamentChecklistCommand>
{
  constructor(private readonly checkListUserService: CheckListUserService) {}

  async execute(command: DeleteUserAssignamentChecklistCommand): Promise<any> {
    await this.checkListUserService.deleteCheckListAssignedUser(command.uuid, command.uuid_checklist)
    return WsResponse.buildOkResponse(null);
  }
}
