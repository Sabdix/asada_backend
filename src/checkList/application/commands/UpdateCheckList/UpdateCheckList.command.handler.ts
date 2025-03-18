import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateCheckListCommand } from './UpdateCheckList.command';
import { CheckListService } from '../../services/checkList.service';
import { CheckListDto } from '../../dtos/CheckList.dto';

@CommandHandler(UpdateCheckListCommand)
export class UpdateCheckListCommandHandler implements ICommandHandler<UpdateCheckListCommand> {
    constructor(
        private checkListService: CheckListService,
    ) { }

    async execute(command: UpdateCheckListCommand): Promise<WsResponse<CheckListDto | string>> {

        const checkList = await this.checkListService.getCheckListByUuid(command.uuid);
        if (!checkList)
            return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

        checkList.name = command.body.name;
        await this.checkListService.updateCheckList(checkList);

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListDto, checkList, { excludeExtraneousValues: true }),
        );
    }
}
