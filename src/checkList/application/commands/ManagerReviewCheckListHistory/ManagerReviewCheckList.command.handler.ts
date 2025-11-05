import { CommandBus, CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { UserService } from 'src/user/application/services/user.service';
import { SendMailNotificationCommand } from 'src/notification/application/commands/SendMailNotification/SendMailNotification.command';
import { mailJetTemplateIds } from 'src/notification/domain/enums/templateIds';
import { ManagerReviewCheckListHistoryCommand } from './ManagerReviewCheckList.command';

@CommandHandler(ManagerReviewCheckListHistoryCommand)
export class ManagerReviewCheckListHistoryCommandHandler implements ICommandHandler<ManagerReviewCheckListHistoryCommand> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private userService: UserService,
    ) { }

    async execute(command: ManagerReviewCheckListHistoryCommand): Promise<WsResponse<CheckListHistoryDto | string>> {

        const checkListHistory = await this.checkListHistoryService.getCheckListHistoryByUuid(command.request.uuid_history);
        if (!checkListHistory)
            return WsResponse.buildNotFoundResponse('CHECKLIST_HISTORY NOT FOUND');

        const user = await this.userService.getUserMannagerByUuid(checkListHistory.uuid_user, command.uuid)
        // if (!user)
        //     return WsResponse.buildNotFoundResponse('MANAGER NOT FOUND');

        checkListHistory.managerApproved = command.request.managerApproved
        checkListHistory.managerComment = command.request.managerComment ?? checkListHistory.managerComment;
        checkListHistory.managerRevised = true

        await this.checkListHistoryService.UpdateCheckListHistoryByUuid(checkListHistory)

        // TODO: Personalize the mail
        // if (!command.request.ManagerApproved && user.manager)
        //     await this.commandBus.execute(new SendMailNotificationCommand({
        //         cc: "",
        //         dynamicTemplateData: {},
        //         subject: "Test Subject",
        //         templateId: mailJetTemplateIds.CHECKLIST_DENIED,
        //         to: user.manager.mail,
        //     }));

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, checkListHistory, { excludeExtraneousValues: true }),
        );
    }
}
