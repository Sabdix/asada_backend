import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { UserService } from 'src/user/application/services/user.service';
import { ReviewCheckListHistoryCommand } from './ReviewCheckListHistory.command';

@CommandHandler(ReviewCheckListHistoryCommand)
export class ReviewCheckListHistoryCommandHandler implements ICommandHandler<ReviewCheckListHistoryCommand> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private userService: UserService
    ) { }

    async execute(command: ReviewCheckListHistoryCommand): Promise<WsResponse<CheckListHistoryDto | string>> {

        const checkListHistory = await this.checkListHistoryService.getCheckListHistoryByUuid(command.request.uuid_history);
        if (!checkListHistory)
            return WsResponse.buildNotFoundResponse('CHECKLIST_HISTORY NOT FOUND');

        const user = await this.userService.getUserMannagerByUuid(checkListHistory.uuid_user, command.uuid)
        if (!user)
            return WsResponse.buildNotFoundResponse('MANAGER NOT FOUND');

        checkListHistory.approved = command.request.approved
        checkListHistory.comment = command.request.comment ?? checkListHistory.comment;
        checkListHistory.revised = true

        await this.checkListHistoryService.UpdateCheckListHistoryByUuid(checkListHistory)

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, checkListHistory, { excludeExtraneousValues: true }),
        );
    }
}
