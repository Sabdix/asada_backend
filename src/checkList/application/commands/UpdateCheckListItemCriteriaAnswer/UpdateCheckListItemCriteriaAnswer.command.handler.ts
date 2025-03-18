import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { UpdateCheckListItemCriteriaAnswerCommand } from './UpdateCheckListItemCriteriaAnswer.command';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';
import { CheckListItemCriteriaAnswerDto } from '../../dtos/CheckListItemCriteriaAnswer.dto';

@CommandHandler(UpdateCheckListItemCriteriaAnswerCommand)
export class UpdateCheckListItemCriteriaAnswerCommandHandler implements ICommandHandler<UpdateCheckListItemCriteriaAnswerCommand> {
    constructor(
        private checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService,
        private checkListItemCriteriaService: CheckListItemCriteriaService
    ) { }

    async execute(command: UpdateCheckListItemCriteriaAnswerCommand): Promise<WsResponse<CheckListItemCriteriaAnswerDto | string>> {

        const checkListItemCriteriaAnswer = await this.checkListItemCriteriaAnswerService.getCheckListItemCriteriaAnswerByUuid(command.uuid);
        if (!checkListItemCriteriaAnswer)
            return WsResponse.buildNotFoundResponse('CHECKLIST_CRITERIA_ANSWER NOT FOUND');

        checkListItemCriteriaAnswer.text =  command.body.text ?? checkListItemCriteriaAnswer.text;
        checkListItemCriteriaAnswer.uuid_check_list_item_criteria =  command.body.uuid_check_list_item_criteria ?? checkListItemCriteriaAnswer.uuid_check_list_item_criteria;

        if(! await this.checkListItemCriteriaService.getCheckListItemCriteriaByUuid(checkListItemCriteriaAnswer.uuid_check_list_item_criteria))
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM_CRITERIA NOT FOUND');

        await this.checkListItemCriteriaAnswerService.updateCheckListItemCriteriaAnswer(checkListItemCriteriaAnswer);

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemCriteriaAnswerDto, checkListItemCriteriaAnswer, { excludeExtraneousValues: true }),
        );
    }
}
