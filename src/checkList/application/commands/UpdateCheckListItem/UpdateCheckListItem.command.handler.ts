import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListService } from '../../services/checkList.service';
import { UpdateCheckListItemCommand } from './UpdateCheckListItem.command';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';

@CommandHandler(UpdateCheckListItemCommand)
export class UpdateCheckListItemCommandHandler implements ICommandHandler<UpdateCheckListItemCommand> {
    constructor(
        private checkListItemService: CheckListItemService,
        private checkListService: CheckListService
    ) { }

    async execute(command: UpdateCheckListItemCommand): Promise<WsResponse<CheckListItemDto | string>> {

        const checkListItem = await this.checkListItemService.getCheckListItemByUuid(command.uuid);
        if (!checkListItem)
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM NOT FOUND');

        checkListItem.name =  command.body.name ?? checkListItem.name;
        checkListItem.uuid_check_list =  command.body.uuid_check_list ?? checkListItem.uuid_check_list;

        if(! await this.checkListService.getCheckListByUuid(checkListItem.uuid_check_list))
            return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

        await this.checkListItemService.updateCheckListItem(checkListItem);

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemDto, checkListItem, { excludeExtraneousValues: true }),
        );
    }
}
