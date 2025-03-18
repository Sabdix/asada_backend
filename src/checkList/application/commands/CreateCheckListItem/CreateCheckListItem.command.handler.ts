import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListService } from '../../services/checkList.service';
import { CheckListDto } from '../../dtos/CheckList.dto';
import { CreateCheckListItemCommand } from './CreateCheckListItem.command';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { CheckListItemService } from '../../services/checkListItem.service';

@CommandHandler(CreateCheckListItemCommand)
export class CreateCheckListItemCommandHandler implements ICommandHandler<CreateCheckListItemCommand> {
  constructor(
    private checkListItemService: CheckListItemService,
    private checkListService: CheckListService
  ) {}

  async execute(command: CreateCheckListItemCommand): Promise<WsResponse<CheckListItemDto | string>> {

    if (await this.checkListItemService.getCheckListItemByNameAndCheckList(command.body.name,command.body.uuid_check_list))
        return WsResponse.buildConflictResponse('CHECKLIST_ITEM ALREADY EXISTS');

    if(! await this.checkListService.getCheckListByUuid(command.body.uuid_check_list))
        return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

    const checkListItem = await this.checkListItemService.creteCheckListItem(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListItemDto, checkListItem, { excludeExtraneousValues: true }),
    );
  }
}
