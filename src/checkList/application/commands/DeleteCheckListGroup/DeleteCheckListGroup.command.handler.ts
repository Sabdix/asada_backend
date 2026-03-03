import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteCheckListGroupCommand } from './DeleteCheckListGroup.command';
import { CheckListGroupService } from '../../services/checkListGroup.service';

@CommandHandler(DeleteCheckListGroupCommand)
export class DeleteCheckListGroupCommandHandler
  implements ICommandHandler<DeleteCheckListGroupCommand>
{
  constructor(private readonly checkListGroupService: CheckListGroupService) {}

  async execute(
    command: DeleteCheckListGroupCommand,
  ): Promise<WsResponse<null | string>> {
    const checkListGroup =
      await this.checkListGroupService.getCheckListGroupByUuid(command.uuid);

    if (!checkListGroup)
      return WsResponse.buildNotFoundResponse('GROUP NOT FOUND');

    await this.checkListGroupService.deleteCheckListGroup(command.uuid);

    return WsResponse.buildOkResponse(null);
  }
}
