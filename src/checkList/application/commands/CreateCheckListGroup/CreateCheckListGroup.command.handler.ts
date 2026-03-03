import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CreateCheckListGroupCommand } from './CreateCheckListGroup.command';
import { CheckListGroupService } from '../../services/checkListGroup.service';
import { CheckListGroupDto } from '../../dtos/CheckListGroup.dto';
import { CheckListGroupCheckListService } from '../../services/checkListGroupCheckList.service';
import { CheckListService } from '../../services/checkList.service';

@CommandHandler(CreateCheckListGroupCommand)
export class CreateCheckListGroupCommandHandler
  implements ICommandHandler<CreateCheckListGroupCommand>
{
  constructor(
    private checkListGroupService: CheckListGroupService,
    private checkListGroupCheckListService: CheckListGroupCheckListService,
    private checkListService: CheckListService,
  ) {}

  async execute(
    command: CreateCheckListGroupCommand,
  ): Promise<WsResponse<CheckListGroupDto | string>> {
    if (
      await this.checkListGroupService.getCheckListGroupByName(
        command.body.name,
      )
    )
      return WsResponse.buildConflictResponse(
        'YA EXISTE UN GRUPO CON ESE NOMBRE',
        'GROUP ALREADY EXISTS',
      );

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

    const checkListGroup =
      await this.checkListGroupService.createCheckListGroup(command.body);

    // Create relations
    for (const checkListItem of command.body.checkLists) {
      await this.checkListGroupCheckListService.createCheckListGroupCheckList(
        checkListGroup.uuid,
        checkListItem.uuid_check_list,
        checkListItem.priority,
      );
    }

    // Get the created group with relations
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
