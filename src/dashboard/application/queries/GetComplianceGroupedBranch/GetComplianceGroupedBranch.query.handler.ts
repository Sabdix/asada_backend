import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetComplianceGroupedBranchQuery } from './GetComplianceGroupedBranch.query';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryService } from 'src/checkList/application/services/checkListHistory.service';
import { BranchService } from 'src/branch/application/services/Branch.service';

@QueryHandler(GetComplianceGroupedBranchQuery)
export class GetComplianceGroupedBranchQueryHandler
  implements IQueryHandler<GetComplianceGroupedBranchQuery>
{
  constructor(
    private checklistHistoryService: CheckListHistoryService,
    private readonly branchService: BranchService,
  ) {}
  async execute(
    query: GetComplianceGroupedBranchQuery,
  ): Promise<WsResponse<any>> {
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

    const branches = await this.branchService.getBranches();

    const compliances: Array<any> = [];

    for (const branch of branches) {
      let compliance =
        await this.checklistHistoryService.getChecklistComplianceSummary(
          query.dateInit,
          query.dateEnd,
          branch.uuid,
          null,
        );
      let completed =
        await this.checklistHistoryService.getTotalChecklistCompleted(
          query.dateInit,
          query.dateEnd,
          branch.uuid,
          null,
        );

      let total = await this.checklistHistoryService.getTotalChecklists(
        query.dateInit,
        query.dateEnd,
        branch.uuid,
        null,
      );

      let incidents =
        await this.checklistHistoryService.getTtotalChecklistsNotAnsweredAndRejected(
          query.dateInit,
          query.dateEnd,
          branch.uuid,
          null,
        );

      compliances.push({
        branch: branch,
        compliance: compliance,
        completed: completed,
        total: total,
        incidents: incidents,
      });
    }

    return WsResponse.buildOkResponse(compliances);
  }
}
