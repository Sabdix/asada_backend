import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { AnswerCheckListCommand } from './AnswerCheckList.command';
import { CheckListUserAnswersService } from '../../services/checkListUserAnswers.service';
import { UserService } from 'src/user/application/services/user.service';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';

@CommandHandler(AnswerCheckListCommand)
export class AnswerCheckListCommandHandler implements ICommandHandler<AnswerCheckListCommand> {
    constructor(
        private checkListUserAnswerService: CheckListUserAnswersService,
        private userService: UserService,
        private checkListHistoryService: CheckListHistoryService,
        private checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService
    ) { }

    async execute(command: AnswerCheckListCommand): Promise<WsResponse<null | string>> {

        const user = await this.userService.getUserByUuid(command.uuid_user)
        if (!user) return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        const checkListHistory = await this.checkListHistoryService.getCheckListHistoyByUuidAndUser(command.body.uuid_check_list_history, command.uuid_user)
        if (!checkListHistory) return WsResponse.buildNotFoundResponse('CHEKLIST_USER_HISTORY NOT FOUND');

        const checkListCriteriaAnswer = await this.checkListItemCriteriaAnswerService.getCheckListItemCriteriaAnswerByUuid(command.body.uuid_check_list_item_criteria_answer)
        if (!checkListCriteriaAnswer) return WsResponse.buildNotFoundResponse('CHEKLIST_ITEM_CRITERIA_ANSWER NOT FOUND');

        if (await this.checkListUserAnswerService.getCheckListUserAnswerByHistoryAndAnswer(command.body.uuid_check_list_history, command.body.uuid_check_list_item_criteria_answer))
            return WsResponse.buildConflictResponse('YA EXISTE UNA RESPUESTA REGISTRADA', 'CHECKLIST_USER_ANSWER ALREADY EXISTS');

        await this.checkListUserAnswerService.creteCheckListHistory(command.body)

        return WsResponse.buildOkResponse(null);
        /*return WsResponse.buildOkResponse(
          plainToInstance(CheckListDto, checkList, { excludeExtraneousValues: true }),
        );*/
    }
}
