import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { UserService } from 'src/user/application/services/user.service';
import { ReassignHistoryCommand } from './ReassignHistory.command';

@CommandHandler(ReassignHistoryCommand)
export class ReassignHistoryCommandHandler implements ICommandHandler<ReassignHistoryCommand> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private userService: UserService
    ) { }

    async execute(command: ReassignHistoryCommand): Promise<WsResponse<CheckListHistoryDto | string>> {

        const checkListHistory = await this.checkListHistoryService.getCheckListHistoryByUuid(command.uuid);
        if (!checkListHistory)
            return WsResponse.buildNotFoundResponse('CHECKLIST_HISTORY NOT FOUND');

        const user = await this.userService.getUserByUuid(command.request.uuid_user)
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        checkListHistory.user = user
        checkListHistory.uuid_user = user.uuid

        await this.checkListHistoryService.UpdateCheckListHistoryByUuid(checkListHistory)
       
        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, checkListHistory, { excludeExtraneousValues: true }),
        );
    }
}
