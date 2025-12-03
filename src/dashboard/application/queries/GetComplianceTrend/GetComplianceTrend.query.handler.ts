import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetComplianceTrendQuery } from './GetComplianceTrend.query';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryService } from 'src/checkList/application/services/checkListHistory.service';

@QueryHandler(GetComplianceTrendQuery)
export class GetComplianceTrendQueryHandler
  implements IQueryHandler<GetComplianceTrendQuery>
{
  constructor(private checklistHistoryService: CheckListHistoryService) {}
  async execute(query: GetComplianceTrendQuery): Promise<WsResponse<any>> {
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

    const results: Array<any> = [];
    const currentDate = new Date(dateInit.getFullYear(), dateInit.getMonth(), 1);

    // Iterate each month from dateInit to dateEnd
    while (currentDate <= dateEnd) {
      // Get first day of the month
      const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      // Get last day of the month
      const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
      
      // Convert to string format (YYYY-MM-DD)
      const firstDayString = firstDayOfMonth.toISOString().split('T')[0];
      const lastDayString = lastDayOfMonth.toISOString().split('T')[0];

      // Process each month
      const compliance =
        await this.checklistHistoryService.getChecklistComplianceSummary(
          firstDayString,
          lastDayString,
          null,
          null,
        );

      results.push({
        month: `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}`,
        firstDay: firstDayString,
        lastDay: lastDayString,
        compliance: compliance,
      });

      // Move to next month
      currentDate.setMonth(currentDate.getMonth() + 1);
    }

    return WsResponse.buildOkResponse(results);
  }
}
