import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { GetCheckListHistoryByUuidQuery } from './getChckListHistoryByUuid.query';

@QueryHandler(GetCheckListHistoryByUuidQuery)
export class GetCheckListHistoryByUuidQueryHandler implements IQueryHandler<GetCheckListHistoryByUuidQuery> {
    constructor(
        private checkListHistoryService: CheckListHistoryService
    ) { }

    async execute(query: GetCheckListHistoryByUuidQuery) {
        const checkListHistory = await this.checkListHistoryService.getCheckListHistoryByUuidWithRelations(query.uuid);
        if (!checkListHistory) return WsResponse.buildNotFoundResponse('CHECKLIST_HISTORY NOT FOUND');

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, checkListHistory, { excludeExtraneousValues: true }),
        );
    }
}
