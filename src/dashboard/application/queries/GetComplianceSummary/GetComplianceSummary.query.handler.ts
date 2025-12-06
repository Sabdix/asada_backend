import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetComplianceQuerySummary } from './GetComplianceSummary.query';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryService } from 'src/checkList/application/services/checkListHistory.service';

@QueryHandler(GetComplianceQuerySummary)
export class GetComplianceQueryHandler
  implements IQueryHandler<GetComplianceQuerySummary>
{
  constructor(private checklistHistoryService: CheckListHistoryService) {}

  async execute(query: GetComplianceQuerySummary): Promise<WsResponse<any>> {
    if (query.dateInit == null) {
      return WsResponse.buildBadRequestResponse('dateInit is required');
    }
    if (query.dateEnd == null) {
      return WsResponse.buildBadRequestResponse('dateEnd is required');
    }

    // Validate dateInit is a valid date
    const dateInit = new Date(query.dateInit);
    if (isNaN(dateInit.getTime())) {
      return WsResponse.buildBadRequestResponse('dateInit is not a valid date');
    }

    // Validate dateEnd is a valid date
    const dateEnd = new Date(query.dateEnd);
    if (isNaN(dateEnd.getTime())) {
      return WsResponse.buildBadRequestResponse('dateEnd is not a valid date');
    }

    const compliance =
      await this.checklistHistoryService.getChecklistComplianceSummary(
        query.dateInit,
        query.dateEnd,
        query.uuidBranch,
        query.uuidBChecklist,
      );
    const completed =
      await this.checklistHistoryService.getTotalChecklistCompleted(
        query.dateInit,
        query.dateEnd,
        query.uuidBranch,
        query.uuidBChecklist,
      );

    const total = await this.checklistHistoryService.getTotalChecklists(
      query.dateInit,
      query.dateEnd,
      query.uuidBranch,
      query.uuidBChecklist,
    );

    let incidents =
      await this.checklistHistoryService.getTtotalChecklistsNotAnsweredAndRejected(
        query.dateInit,
        query.dateEnd,
        query.uuidBranch,
        query.uuidBChecklist,
      );

    return WsResponse.buildOkResponse({
      compliance: compliance,
      completed: completed,
      total: total,
      incidents: incidents,
    });
  }
}
