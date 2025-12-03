import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetComplianceGroupedBranchQuery } from 'src/dashboard/application/queries/GetComplianceGroupedBranch/GetComplianceGroupedBranch.query';
import { GetComplianceGroupedBranchAndChecklistQuery } from 'src/dashboard/application/queries/GetComplianceGroupedBranchAndChecklist/GetComplianceGroupedBranchAndChecklist.query';
import { GetComplianceQuerySummary } from 'src/dashboard/application/queries/GetComplianceSummary/GetComplianceSummary.query';

@Controller('dashboard')
export class DashboardController {
  constructor(private queryBus: QueryBus) {}

  @Get('compliance/summary')
  async getComplianceSummary(
    @Query('dateInit') dateInit: string,
    @Query('dateEnd') dateEnd: string,
    @Query('uuidBranch') uuidBranch: string,
  ) {
    return this.queryBus.execute(
      new GetComplianceQuerySummary(dateInit, dateEnd, uuidBranch),
    );
  }

  @Get('compliance/branch')
  async getComplianceGroupedByBranch(
    @Query('dateInit') dateInit: string,
    @Query('dateEnd') dateEnd: string,
  ) {
    return this.queryBus.execute(
      new GetComplianceGroupedBranchQuery(dateInit, dateEnd),
    );
  }

  @Get('compliance/checklist/branch')
  async getComplianceGroupedByBranchAndChecklist(
    @Query('dateInit') dateInit: string,
    @Query('dateEnd') dateEnd: string,
    @Query('uuidBranch') uuidBranch: string,
  ) {
    return this.queryBus.execute(
      new GetComplianceGroupedBranchAndChecklistQuery(dateInit, dateEnd, uuidBranch),
    );
  }
}
