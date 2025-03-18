import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { UpdateCheckListItemCriteriaCommand } from './UpdateCheckListItemCriteria.command';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';

@CommandHandler(UpdateCheckListItemCriteriaCommand)
export class UpdateCheckListItemCriteriaCommandHandler implements ICommandHandler<UpdateCheckListItemCriteriaCommand> {
    constructor(
        private checkListItemCriteriaService: CheckListItemCriteriaService,
        private checkListItemService: CheckListItemService
    ) { }

    async execute(command: UpdateCheckListItemCriteriaCommand): Promise<WsResponse<CheckListItemCriteriaDto | string>> {

        const checkListItemCriteria = await this.checkListItemCriteriaService.getCheckListItemCriteriaByUuid(command.uuid);
        if (!checkListItemCriteria)
            return WsResponse.buildNotFoundResponse('CHECKLIST_CRITERIA NOT FOUND');

        checkListItemCriteria.text =  command.body.text ?? checkListItemCriteria.text;
        checkListItemCriteria.uuid_check_list_item =  command.body.uuid_check_list_item ?? checkListItemCriteria.uuid_check_list_item;

        if(! await this.checkListItemService.getCheckListItemByUuid(checkListItemCriteria.uuid_check_list_item))
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM NOT FOUND');

        await this.checkListItemCriteriaService.updateCheckListItemCriteria(checkListItemCriteria);

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemCriteriaDto, checkListItemCriteria, { excludeExtraneousValues: true }),
        );
    }
}
