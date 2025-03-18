import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CreateCheckListItemCriteriaCommand } from './CreateCheckListItemCriteria.command';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';

@CommandHandler(CreateCheckListItemCriteriaCommand)
export class CreateCheckListItemCriteriaCommandHandler implements ICommandHandler<CreateCheckListItemCriteriaCommand> {
  constructor(
      private checkListItemCriteriaService: CheckListItemCriteriaService,
      private checkListItemService: CheckListItemService
  ) {}

  async execute(command: CreateCheckListItemCriteriaCommand): Promise<WsResponse<CheckListItemCriteriaDto | string>> {

    if (await this.checkListItemCriteriaService.getCheckListItemCriteriaByTextAndItem(command.body.text, command.body.uuid_check_list_item))
        return WsResponse.buildConflictResponse('CHECKLIST_ITEM_CRITERIA ALREADY EXISTS');

    if(! await this.checkListItemService.getCheckListItemByUuid(command.body.uuid_check_list_item))
        return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM NOT FOUND');

    const checkListItemCriteria = await this.checkListItemCriteriaService.creteCheckListItemCriteria(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListItemCriteriaDto, checkListItemCriteria, { excludeExtraneousValues: true }),
    );
  }
}
