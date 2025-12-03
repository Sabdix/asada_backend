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
    const currentDate = new Date(dateInit);

    // Iterate from dateInit to dateEnd
    while (currentDate <= dateEnd) {
      // Convert date to string format (YYYY-MM-DD)
      const dateString = currentDate.toISOString().split('T')[0];

      // Process each day
      const compliance =
        await this.checklistHistoryService.getChecklistComplianceSummary(
          dateString,
          dateString,
          null,
          null,
        );

      results.push({
        date: dateString,
        compliance: compliance,
      });

      // Move to next day
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return WsResponse.buildOkResponse(results);
  }
}
