import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateHistoryStatusCommand } from './UpdateHistoryStatus.command';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { CheckListHistoryService } from '../../services/checkListHistory.service';

@CommandHandler(UpdateHistoryStatusCommand)
export class UpdateHistoryStatusCommandHandler implements ICommandHandler<UpdateHistoryStatusCommand> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
    ) { }

    async execute(command: UpdateHistoryStatusCommand): Promise<WsResponse<CheckListHistoryDto | string>> {

        const checkListHistory = await this.checkListHistoryService.getCheckListHistoryByUuid(command.uuid);
        if (!checkListHistory)
            return WsResponse.buildNotFoundResponse('CHECKLIST_HISTORY NOT FOUND');

        checkListHistory.status = true

        await this.checkListHistoryService.UpdateCheckListHistoryByUuid(checkListHistory)
       
        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, checkListHistory, { excludeExtraneousValues: true }),
        );
    }
}
