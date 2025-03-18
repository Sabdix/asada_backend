import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { GetItemCriteriaByItemQuery } from './getItemCriteriaByItem.query';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';

@QueryHandler(GetItemCriteriaByItemQuery)
export class GetItemCriteriaByItemQueryHandler implements IQueryHandler<GetItemCriteriaByItemQuery> {
    constructor(
        private checkListItemCriteriaService: CheckListItemCriteriaService,
        private checkListItemService: CheckListItemService,
        
    ) { }

    async execute(query: GetItemCriteriaByItemQuery): Promise<WsResponse<CheckListItemCriteriaDto[] | string>> {
        if (!await this.checkListItemService.getCheckListItemByUuid(query.uuid))
            return WsResponse.buildNotFoundResponse('CHECKLIST_ITEM NOT FOUND');

        const itemCriteria = await this.checkListItemCriteriaService.getItemCriteriaByItem(query.uuid);

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemCriteriaDto, itemCriteria, { excludeExtraneousValues: true }),
        );
    }
}
