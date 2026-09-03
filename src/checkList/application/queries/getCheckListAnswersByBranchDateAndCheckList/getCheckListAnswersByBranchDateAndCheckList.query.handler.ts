import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListAnswersByBranchDateAndCheckListQuery } from './getCheckListAnswersByBranchDateAndCheckList.query';
import { CheckListUserAnswersService } from '../../services/checkListUserAnswers.service';
import { CheckListUserAnswersDto } from '../../dtos/CheckListUserAnswers.dto';
import { AnswerDto } from '../../dtos/Answer.dto';
import { CriteriaDto } from '../../dtos/Criteria.dto';
import { ItemDto } from '../../dtos/Item.dto';
import { CheckDto } from '../../dtos/Check.dto';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { CheckListService } from '../../services/checkList.service';

@QueryHandler(GetCheckListAnswersByBranchDateAndCheckListQuery)
export class GetCheckListAnswersByBranchDateAndCheckListQueryHandler
  implements IQueryHandler<GetCheckListAnswersByBranchDateAndCheckListQuery>
{
  constructor(
    private readonly checkListUserAnswersService: CheckListUserAnswersService,
    private readonly branchService: BranchService,
    private readonly checkListService: CheckListService,
  ) {}

  async execute(query: GetCheckListAnswersByBranchDateAndCheckListQuery) {
    const branch = await this.branchService.getBranchByUuid(query.uuidBranch);
    if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

    const checkList = await this.checkListService.getCheckListByUuid(query.uuidCheckList);
    if (!checkList) return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

    const checkListAnswers =
      await this.checkListUserAnswersService.getCheckListUserAnswersByBranchDateAndCheckList(
        query.uuidBranch,
        query.date,
        query.uuidCheckList,
      );

    const response = new Array<CheckListUserAnswersDto>();

    for (const userAnswer of checkListAnswers) {
      const answer = new CheckListUserAnswersDto();
      answer.comment = userAnswer.comment;
      answer.uuid_check_list_history = userAnswer.uuid_check_list_history;
      answer.uuid_check_list_item_criteria_answer =
        userAnswer.uuid_check_list_item_criteria_answer;

      if (userAnswer.check_list_criteria_answer) {
        answer.check_list_criteria_answer = new AnswerDto();
        answer.check_list_criteria_answer.text =
          userAnswer.check_list_criteria_answer.text;
        answer.check_list_criteria_answer.uuid =
          userAnswer.check_list_criteria_answer.uuid;
        answer.check_list_criteria_answer.requieres_action =
          userAnswer.check_list_criteria_answer.requieres_action;

        if (userAnswer.check_list_criteria_answer.checkListItemCriteria) {
          answer.check_list_criteria_answer.checkListItemCriteria =
            new CriteriaDto();
          answer.check_list_criteria_answer.checkListItemCriteria.text =
            userAnswer.check_list_criteria_answer.checkListItemCriteria.text;
          answer.check_list_criteria_answer.checkListItemCriteria.uuid =
            userAnswer.check_list_criteria_answer.checkListItemCriteria.uuid;

          if (
            userAnswer.check_list_criteria_answer.checkListItemCriteria
              .checkListItem
          ) {
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem =
              new ItemDto();
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.name =
              userAnswer.check_list_criteria_answer.checkListItemCriteria.checkListItem.name;
            answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.uuid =
              userAnswer.check_list_criteria_answer.checkListItemCriteria.checkListItem.uuid;

            if (
              userAnswer.check_list_criteria_answer.checkListItemCriteria
                .checkListItem.check_list
            ) {
              answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list =
                new CheckDto();
              answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list.name =
                userAnswer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list.name;
              answer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list.uuid =
                userAnswer.check_list_criteria_answer.checkListItemCriteria.checkListItem.check_list.uuid;
            }
          }
        }
      }
      response.push(answer);
    }

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListUserAnswersDto, response, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
