import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListItemsByCheckListQuery } from './getCheckListItemsByCheckList.query';
import { CheckListItemService } from '../../services/checkListItem.service';
import { CheckListService } from '../../services/checkList.service';
import { CheckListItemDto } from '../../dtos/CheckListItem.dto';

@QueryHandler(GetCheckListItemsByCheckListQuery)
export class GetCheckListItemsByCheckListQueryHandler implements IQueryHandler<GetCheckListItemsByCheckListQuery> {
    constructor(
        private checkListItemService: CheckListItemService,
        private checkListService: CheckListService
    ) { }

    async execute(query: GetCheckListItemsByCheckListQuery): Promise<WsResponse<CheckListItemDto[] | string>> {
        if (!await this.checkListService.getCheckListByUuid(query.uuid))
            return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

        const items = await this.checkListItemService.getCheckListItemByCheckList(query.uuid);

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListItemDto, items, { excludeExtraneousValues: true }),
        );
    }
}
