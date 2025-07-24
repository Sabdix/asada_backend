import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListByUuidQuery } from './getCheckListByUuid.query';
import { CheckListService } from '../../services/checkList.service';
import { CheckListDto } from '../../dtos/CheckList.dto';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { CriteriaByItemDto } from '../../dtos/CriteriaByItem.dto';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';
import { AnswerByCriteriaDto } from '../../dtos/AnswerByCriteria.dto';

@QueryHandler(GetCheckListByUuidQuery)
export class GetCheckListByUuidQueryHandler implements IQueryHandler<GetCheckListByUuidQuery> {
  constructor(
    private checkListService: CheckListService,
    private checkListItemService: CheckListItemService,
    private checkListItemCriteriaService: CheckListItemCriteriaService,
    private checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService
  ) { }

  async execute(query: GetCheckListByUuidQuery) {
    const checkList = await this.checkListService.getCheckListByUuid(query.uuid);

    if (!checkList) return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

    const response = new CheckListDto

    response.name = checkList.name
    response.uuid = checkList.uuid
    response.checkListItem = new Array<CheckListItemDto>

    const items = await this.checkListItemService.getCheckListItemByCheckList(checkList.uuid)

    for (const element of items) {
      const itemsWithCriteria = new CheckListItemDto

      itemsWithCriteria.name = element.name
      itemsWithCriteria.uuid = element.uuid

      itemsWithCriteria.checkListItemCriteria = new Array<CriteriaByItemDto>

      const criteria = await this.checkListItemCriteriaService.getItemCriteriaByItem(element.uuid)
      for (const element2 of criteria) {
        const criteriaWithAnswer = new CriteriaByItemDto

        criteriaWithAnswer.text = element2.text
        criteriaWithAnswer.uuid = element2.uuid

        criteriaWithAnswer.checkListItemCriteria = new Array<AnswerByCriteriaDto>

        const answers = await this.checkListItemCriteriaAnswerService.getCriteriaAnswerByCriteria(element2.uuid)

        for (const element3 of answers) {
          const answer = new AnswerByCriteriaDto

          answer.text = element3.text
          answer.uuid = element3.uuid
          answer.requieres_action = element3.requieres_action
          criteriaWithAnswer.checkListItemCriteria.push(answer)
        }
        
        itemsWithCriteria.checkListItemCriteria?.push(criteriaWithAnswer)
      }
      response.checkListItem.push(itemsWithCriteria)
    }
    return WsResponse.buildOkResponse(
      plainToInstance(CheckListDto, response, { excludeExtraneousValues: true }),
    );
  }
}
