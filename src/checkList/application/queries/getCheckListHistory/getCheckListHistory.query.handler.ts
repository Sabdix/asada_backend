import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListHistoryQuery } from './getCheckListHistory.query';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';

@QueryHandler(GetCheckListHistoryQuery)
export class GetCheckListHistoryQueryHandler implements IQueryHandler<GetCheckListHistoryQuery> {
    constructor(
        private checkListHistoryService: CheckListHistoryService
    ) { }

    async execute(query: GetCheckListHistoryQuery) {
        const [checkListHistory, total] = await this.checkListHistoryService.getAllCheckListHistoryPaginated(query.size, query.offset);

        return WsResponse.buildOkListResponse(
            plainToInstance(CheckListHistoryDto, checkListHistory, { excludeExtraneousValues: true }), total
        );
    }
}
