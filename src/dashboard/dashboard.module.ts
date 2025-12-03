import { forwardRef, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CheckListModule } from 'src/checkList/CheckList.module';
import { DashboardController } from './infrastructure/controllers/dashboard.controller';
import { GetComplianceQueryHandler } from './application/queries/GetComplianceSummary/GetComplianceSummary.query.handler';
import { GetComplianceGroupedBranchQueryHandler } from './application/queries/GetComplianceGroupedBranch/GetComplianceGroupedBranch.query.handler';
import { BranchModule } from 'src/branch/Branch.module';
import { GetComplianceGroupedBranchAndChecklistQueryHandler } from './application/queries/GetComplianceGroupedBranchAndChecklist/GetComplianceGroupedBranchAndChecklist.query.handler';
import { GetComplianceTrendQueryHandler } from './application/queries/GetComplianceTrend/GetComplianceTrend.query.handler';
@Module({
  imports: [ConfigModule.forRoot(), CheckListModule, BranchModule],
  controllers: [DashboardController],
  providers: [
    GetComplianceQueryHandler,
    GetComplianceGroupedBranchQueryHandler,
    GetComplianceGroupedBranchAndChecklistQueryHandler,
    GetComplianceTrendQueryHandler
  ],
})
export class DashboardModule {}
