import { Controller, Get, Query, ValidationPipe } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetComplianceGroupedBranchDto } from 'src/dashboard/application/dtos/GetComplianceGroupedBranch.dto';
import { GetChecklistsPendingQuery } from 'src/dashboard/application/queries/GetChecklistsPending/GetChecklistsPending.query';
import { GetComplianceGroupedBranchQuery } from 'src/dashboard/application/queries/GetComplianceGroupedBranch/GetComplianceGroupedBranch.query';
import { GetComplianceGroupedBranchAndChecklistQuery } from 'src/dashboard/application/queries/GetComplianceGroupedBranchAndChecklist/GetComplianceGroupedBranchAndChecklist.query';
import { GetComplianceQuerySummary } from 'src/dashboard/application/queries/GetComplianceSummary/GetComplianceSummary.query';
import { GetComplianceTrendQuery } from 'src/dashboard/application/queries/GetComplianceTrend/GetComplianceTrend.query';

@Controller('dashboard')
export class DashboardController {
  constructor(private queryBus: QueryBus) {}

  @Get('compliance/summary')
  async getComplianceSummary(
    @Query('dateInit') dateInit: string,
    @Query('dateEnd') dateEnd: string,
    @Query('uuidBranch') uuidBranch: string,
    @Query('uuidChecklist') uuidChecklist: string,
  ) {
    return this.queryBus.execute(
      new GetComplianceQuerySummary(
        dateInit,
        dateEnd,
        uuidBranch,
        uuidChecklist,
      ),
    );
  }

  @Get('compliance/branch')
  async getComplianceGroupedByBranch(
    @Query(new ValidationPipe({ transform: true }))
    query: GetComplianceGroupedBranchDto,
  ) {
    return this.queryBus.execute(
      new GetComplianceGroupedBranchQuery(query.dateInit, query.dateEnd, query.uuidChecklist),
    );
  }

  @Get('compliance/checklist/branch')
  async getComplianceGroupedByBranchAndChecklist(
    @Query('dateInit') dateInit: string,
    @Query('dateEnd') dateEnd: string,
    @Query('uuidBranch') uuidBranch: string,
  ) {
    return this.queryBus.execute(
      new GetComplianceGroupedBranchAndChecklistQuery(
        dateInit,
        dateEnd,
        uuidBranch,
      ),
    );
  }

  @Get('compliance/trend')
  async getComplianceTrend(
    @Query('dateInit') dateInit: string,
    @Query('dateEnd') dateEnd: string,
    @Query('uuidBranch') uuidBranch: string,
    @Query('uuidChecklist') uuidChecklist: string,
  ) {
    return this.queryBus.execute(
      new GetComplianceTrendQuery(dateInit, dateEnd, uuidBranch, uuidChecklist),
    );
  }

  @Get('checklist/pending')
  async getChecklistsPending(
    @Query('dateInit') dateInit: string,
    @Query('dateEnd') dateEnd: string,
    @Query('uuidBranch') uuidBranch: string,
    @Query('uuidChecklist') uuidChecklist: string,
  ) {
    return this.queryBus.execute(
      new GetChecklistsPendingQuery(
        dateInit,
        dateEnd,
        uuidBranch,
        uuidChecklist,
      ),
    );
  }
}
