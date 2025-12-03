import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetComplianceGroupedBranchAndChecklistQuery } from './GetComplianceGroupedBranchAndChecklist.query';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryService } from 'src/checkList/application/services/checkListHistory.service';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { CheckListService } from 'src/checkList/application/services/checkList.service';

@QueryHandler(GetComplianceGroupedBranchAndChecklistQuery)
export class GetComplianceGroupedBranchAndChecklistQueryHandler
  implements IQueryHandler<GetComplianceGroupedBranchAndChecklistQuery>
{
  constructor(
    private checklistHistoryService: CheckListHistoryService,
    private readonly branchService: BranchService,
    private readonly checkListService: CheckListService,
  ) {}

  async execute(
    query: GetComplianceGroupedBranchAndChecklistQuery,
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

    const checklists = await this.checkListService.getCheckList();
    const branches = await this.branchService.getBranches();

    const responses: Array<any> = [];

    for (const checklist of checklists) {
      if (query.uuidBranch) {
        const branch = branches.find((b) => b.uuid === query.uuidBranch);
        if (!branch) {
          return WsResponse.buildBadRequestResponse('Branch not found');
        }
        let result = {
          checklist: checklist.name,
        };
        const compliance =
          await this.checklistHistoryService.getChecklistComplianceSummary(
            query.dateInit,
            query.dateEnd,
            query.uuidBranch,
            checklist.uuid,
          );
        result[branch.name] = compliance;
        responses.push(result);
      } else {
        let result = {
          checklist: checklist.name,
        };
        for (const branch of branches) {
          const compliance =
            await this.checklistHistoryService.getChecklistComplianceSummary(
              query.dateInit,
              query.dateEnd,
              branch.uuid,
              checklist.uuid,
            );
          result[branch.name] = compliance;
        }
        responses.push(result);
      }
    }

    return WsResponse.buildOkResponse(responses);
  }
}
