import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCheckListGroupCommand } from './UpdateCheckListGroup.command';
import { CheckListGroupService } from '../../services/checkListGroup.service';
import { CheckListGroupDto } from '../../dtos/CheckListGroup.dto';
import { CheckListGroupCheckListService } from '../../services/checkListGroupCheckList.service';
import { CheckListService } from '../../services/checkList.service';

@CommandHandler(UpdateCheckListGroupCommand)
export class UpdateCheckListGroupCommandHandler
  implements ICommandHandler<UpdateCheckListGroupCommand>
{
  constructor(
    private checkListGroupService: CheckListGroupService,
    private checkListGroupCheckListService: CheckListGroupCheckListService,
    private checkListService: CheckListService,
  ) {}

  async execute(
    command: UpdateCheckListGroupCommand,
  ): Promise<WsResponse<CheckListGroupDto | string>> {
    const checkListGroup =
      await this.checkListGroupService.getCheckListGroupByUuid(command.uuid);
    if (!checkListGroup)
      return WsResponse.buildNotFoundResponse('GROUP NOT FOUND');

    // Validate all checkLists exist
    for (const checkListItem of command.body.checkLists) {
      const checkList = await this.checkListService.getCheckListByUuid(
        checkListItem.uuid_check_list,
      );
      if (!checkList) {
        return WsResponse.buildNotFoundResponse(
          `CHECKLIST ${checkListItem.uuid_check_list} NOT FOUND`,
        );
      }
    }

    checkListGroup.name = command.body.name;
    await this.checkListGroupService.updateCheckListGroup(checkListGroup);

    // Delete existing relations
    await this.checkListGroupCheckListService.deleteByGroupUuid(command.uuid);

    // Create new relations
    for (const checkListItem of command.body.checkLists) {
      await this.checkListGroupCheckListService.createCheckListGroupCheckList(
        checkListGroup.uuid,
        checkListItem.uuid_check_list,
        checkListItem.priority,
      );
    }

    // Get the updated group with relations
    const relations =
      await this.checkListGroupCheckListService.getByGroupUuid(
        checkListGroup.uuid,
      );

    const result = {
      ...checkListGroup,
      checkLists: relations.map((rel) => ({
        uuid_check_list: rel.uuid_check_list,
        priority: rel.priority,
        checkListName: rel.checkList?.name,
      })),
    };

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListGroupDto, result, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
