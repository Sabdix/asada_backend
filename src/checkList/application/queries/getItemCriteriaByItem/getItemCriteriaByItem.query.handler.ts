import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { GetItemCriteriaByItemQuery } from './getItemCriteriaByItem.query';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';
import { CheckListItemCriteriaAnswerService } from '../../services/checkListItemCriteriaAnswer.service';

@QueryHandler(GetItemCriteriaByItemQuery)
export class GetItemCriteriaByItemQueryHandler implements IQueryHandler<GetItemCriteriaByItemQuery> {
    constructor(
        private checkListItemCriteriaService: CheckListItemCriteriaService,
        private checkListItemService: CheckListItemService,
        private checkListItemCriteriaAnswerService: CheckListItemCriteriaAnswerService        
    ) { }

    async execute(query: GetItemCriteriaByItemQuery): Promise<WsResponse<CheckListItemCriteriaDto[] | string>> {
        if (!await this.checkListItemService.getCheckListItemByUuid(query.uuid))
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM NOT FOUND');

        const itemCriteria = await this.checkListItemCriteriaService.getItemCriteriaByItem(query.uuid);

        const response = new Array<CheckListItemCriteriaDto>

        for (const element of itemCriteria) {
            const ItemCriteriaWithAnswer = new CheckListItemCriteriaDto

            ItemCriteriaWithAnswer.text = element.text
            ItemCriteriaWithAnswer.uuid = element.uuid
            ItemCriteriaWithAnswer.checkListItemCriteriaAnswer = await this.checkListItemCriteriaAnswerService.getCriteriaAnswerByCriteria(element.uuid)
            response.push(ItemCriteriaWithAnswer)
        }

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemCriteriaDto, response, { excludeExtraneousValues: true }),
        );
    }
}
