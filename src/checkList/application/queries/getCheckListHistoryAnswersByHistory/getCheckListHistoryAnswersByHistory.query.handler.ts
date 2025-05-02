import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { getCheckListHistoryAnswersByHistoryQuery } from './getCheckListHistoryAnswersByHistory.query';
import { CheckListUserAnswersDto } from '../../dtos/CheckListUserAnswers.dto';
import { CheckListUserAnswersService } from '../../services/checkListUserAnswers.service';
import { response } from 'express';
import { AnswerDto } from '../../dtos/Answer.dto';
import { CriteriaDto } from '../../dtos/Criteria.dto';
import { ItemDto } from '../../dtos/Item.dto';
import { CheckDto } from '../../dtos/Check.dto';

@QueryHandler(getCheckListHistoryAnswersByHistoryQuery)
export class getCheckListHistoryAnswersByHistoryQueryHandler implements IQueryHandler<getCheckListHistoryAnswersByHistoryQuery> {
    constructor(
        private checkListUserAnswersService: CheckListUserAnswersService,
        private CheckListHistoryService: CheckListHistoryService
    ) { }

    async execute(query: getCheckListHistoryAnswersByHistoryQuery) {
        
        const chekListUserHistory = await this.CheckListHistoryService.getCheckListHistoryByUuid(query.uuid)
        if (!chekListUserHistory)
            return WsResponse.buildNotFoundResponse('CHECKLIST_HISTORY NOT EXISTS');

        const checkListHistory = await this.checkListUserAnswersService.getCheckListUserAnswerByHistory(query.uuid);

        const response = new Array<CheckListUserAnswersDto>

        for (const userAnswer of checkListHistory ){
            const answer = new CheckListUserAnswersDto
            answer.comment = userAnswer.comment
            answer.uuid_check_list_history = userAnswer.uuid_check_list_history
            answer.uuid_check_list_item_criteria_answer = userAnswer.uuid_check_list_item_criteria_answer
            answer.check_list_criteria_answer = new AnswerDto
            answer.check_list_criteria_answer.text =  userAnswer.check_list_criteria_answer.text
            answer.check_list_criteria_answer.uuid =  userAnswer.check_list_criteria_answer.uuid
            answer.check_list_criteria_answer.requieres_action =  userAnswer.check_list_criteria_answer.requieres_action
            answer.check_list_criteria_answer.uuid =  userAnswer.check_list_criteria_answer.uuid
            answer.check_list_criteria_answer.checkListItemCriteria = new CriteriaDto
            answer.check_list_criteria_answer.checkListItemCriteria.text = userAnswer.check_list_criteria_answer.checkListItemCriteria.text
            answer.check_list_criteria_answer.checkListItemCriteria.uuid = userAnswer.check_list_criteria_answer.checkListItemCriteria.uuid
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem = new ItemDto
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.name = userAnswer.check_list_criteria_answer.checkListItemCriteria.checkListItem.name
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.uuid = userAnswer.check_list_criteria_answer.checkListItemCriteria.checkListItem.uuid
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list = new CheckDto
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list.name = userAnswer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list.name
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list.uuid = userAnswer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list.uuid
            response.push(answer)
        }
        return WsResponse.buildOkResponse(
            plainToInstance(CheckListUserAnswersDto, response, { excludeExtraneousValues: true }),
        );
    }
}
