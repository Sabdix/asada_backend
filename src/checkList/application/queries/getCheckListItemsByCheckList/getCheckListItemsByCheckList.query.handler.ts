import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListItemsByCheckListQuery } from './getCheckListItemsByCheckList.query';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CheckListService } from '../../services/checkList.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';
import { CheckListItemCriteriaService } from '../../services/checkListItemCriteria.service';

@QueryHandler(GetCheckListItemsByCheckListQuery)
export class GetCheckListItemsByCheckListQueryHandler implements IQueryHandler<GetCheckListItemsByCheckListQuery> {
    constructor(
        private checkListItemService: CheckListItemService,
        private checkListService: CheckListService,
        private checkListItemCriteriaService: CheckListItemCriteriaService
    ) { }

    async execute(query: GetCheckListItemsByCheckListQuery): Promise<WsResponse<CheckListItemDto[] | string>> {
        if (!await this.checkListService.getCheckListByUuid(query.uuid))
            return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

        const items = await this.checkListItemService.getCheckListItemByCheckList(query.uuid);

        const response = new Array<CheckListItemDto>

        for (const element of items) {
            const checkListItemWithCriteria = new CheckListItemDto

            checkListItemWithCriteria.name = element.name
            checkListItemWithCriteria.uuid = element.uuid
            checkListItemWithCriteria.checkListItemCriteria = await this.checkListItemCriteriaService.getItemCriteriaByItem(element.uuid)
            response.push(checkListItemWithCriteria)
        }

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemDto, response, { excludeExtraneousValues: true }),
        );
    }
}
