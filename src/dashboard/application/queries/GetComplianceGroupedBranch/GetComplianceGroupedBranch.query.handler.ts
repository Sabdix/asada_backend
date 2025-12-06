import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetComplianceGroupedBranchQuery } from './GetComplianceGroupedBranch.query';
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
  ): Promise<any> {
    const [branches, complianceData] = await Promise.all([
      this.branchService.getBranches(),
      this.checklistHistoryService.getBranchComplianceSummary(
        query.dateInit,
        query.dateEnd,
        query.uuidChecklist,
      ),
    ]);

    const complianceMap = new Map(
      complianceData.map((item) => [
        item.uuid_branch,
        {
          total: parseInt(item.total, 10) || 0,
          completed: parseInt(item.completed, 10) || 0,
          incidents: parseInt(item.incidents, 10) || 0,
        },
      ]),
    );

    return branches.map((branch) => {
      const data = complianceMap.get(branch.uuid) || {
        total: 0,
        completed: 0,
        incidents: 0,
      };
      const compliance = data.total > 0 ? (data.completed / data.total) * 100 : 0;
      return {
        branch: branch,
        compliance: compliance,
        ...data,
      };
    });
  }
}
