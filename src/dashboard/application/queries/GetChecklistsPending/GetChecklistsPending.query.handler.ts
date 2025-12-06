import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetChecklistsPendingQuery } from './GetChecklistsPending.query';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryService } from 'src/checkList/application/services/checkListHistory.service';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryDto } from 'src/checkList/application/dtos/CheckListHistory.dto';

@QueryHandler(GetChecklistsPendingQuery)
export class GetChecklistsPendingQueryHandler
  implements IQueryHandler<GetChecklistsPendingQuery>
{
  constructor(private checkListHistoryService: CheckListHistoryService) {}

  async execute(query: GetChecklistsPendingQuery): Promise<WsResponse<any>> {
    const checklists =
      await this.checkListHistoryService.getTodayChecklistsHistoryPendingAndRejected(
        query.dateInit,
        query.dateEnd,
        query.uuidBranch,
        query.uuidChecklist,
      );

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListHistoryDto, checklists, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
