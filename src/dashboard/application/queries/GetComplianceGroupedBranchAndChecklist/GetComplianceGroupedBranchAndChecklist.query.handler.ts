import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetComplianceGroupedBranchAndChecklistQuery } from './GetComplianceGroupedBranchAndChecklist.query';
import { CheckListHistoryService } from 'src/checkList/application/services/checkListHistory.service';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { CheckListService } from 'src/checkList/application/services/checkList.service';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

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
  ): Promise<any> {
    const [allChecklists, allBranches, complianceData] = await Promise.all([
      this.checkListService.getCheckList(),
      this.branchService.getBranches(),
      this.checklistHistoryService.getComplianceData(
        query.dateInit,
        query.dateEnd,
        query.uuidBranch,
      ),
    ]);

    const branches = query.uuidBranch
      ? allBranches.filter((b) => b.uuid === query.uuidBranch)
      : allBranches;

    // Group data by checklist and branch
    const complianceByChecklistAndBranch = complianceData.reduce(
      (acc, item) => {
        const checklistId = item.clh_uuid_check_list;
        const branchId = item.u_uuid_branch;

        if (!checklistId || !branchId) return acc;

        const key = `${checklistId}-${branchId}`;
        if (!acc[key]) {
          acc[key] = { total: 0, completed: 0 };
        }

        acc[key].total++;
        const isCompleted = item.clh_status === 1;

        if (isCompleted) {
          acc[key].completed++;
        }

        return acc;
      },
      {},
    );

    return WsResponse.buildOkResponse(
      allChecklists.map((checklist) => {
        const result = {
          checklist: checklist.name,
        };

        for (const branch of branches) {
          const key = `${checklist.uuid}-${branch.uuid}`;
          const data = complianceByChecklistAndBranch[key];
          const compliance =
            data && data.total > 0 ? (data.completed / data.total) * 100 : 0;
          result[branch.name] = compliance;
        }
        return result;
      }),
    );
  }
}
