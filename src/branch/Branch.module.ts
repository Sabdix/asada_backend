import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Branch } from "./domain/entities/Branch.entity";
import { branchController } from "./infrastructure/controllers/branch.controller";
import { BranchRepository } from "./infrastructure/repositories/branch.repository";
import { BranchService } from "./application/services/Branch.service";
import { CreateBranchCommandHandler } from "./application/commands/CreateBranch/CreateBranch.command.handler";
import { GetBranchByUuidQueryHandler } from "./application/queries/GetBranchByUuid/GetBranchByUuid.query.handler";
import { GetBranchesQueryHandler } from "./application/queries/GetBranches/GetBranches.query.handler";
import { DeleteBranchCommandHandler } from "./application/commands/DeleteBranch/DeleteBranch.command.handler";

import { UpdateBranchCommandHandler } from "./application/commands/UpdateBranch/UpdateBranch.command.handler";
import { GetBranchQrByUuidQueryHandler } from "./application/queries/GetBranchQrByUuid/GetBranchQrByUuid.query.handler";
import { BranchReview } from "./domain/entities/BranchReview.entity";
import { BranchReviewRepository } from "./infrastructure/repositories/branchReview.repository";
import { BranchReviewService } from "./application/services/BranchReview.service";
import { CreateBranchReviewCommandHandler } from "./application/commands/CreateBranchReview/CreateBranchReview.command.handler";
import { GetBranchReviewsQueryHandler } from "./application/queries/GetBranchReviews/GetBranchReviews.query.handler";
import { GetBranchReviewsByUuidQueryHandler } from "./application/queries/GetBranchReviewsByUuid/GetBranchReviewsByUuid.query.handler";
import { DownloadReviewReportQueryHandler } from "./application/queries/DownloadReviewReport/DownloadReviewReport.query.handler";
import { DownloadReviewReport64QueryHandler } from "./application/queries/DownloadReviewReport64/DownloadReviewReport64.query.handler";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Branch, BranchReview]),
    ],
    providers: [
        BranchRepository,
        BranchReviewRepository,
        BranchService,
        BranchReviewService,
        CreateBranchCommandHandler,
        GetBranchByUuidQueryHandler,
        GetBranchesQueryHandler,
        DeleteBranchCommandHandler,
        UpdateBranchCommandHandler,
        GetBranchQrByUuidQueryHandler,
        DownloadReviewReportQueryHandler,
        DownloadReviewReport64QueryHandler,

        CreateBranchReviewCommandHandler,
        GetBranchReviewsQueryHandler,
        GetBranchReviewsByUuidQueryHandler
    ],
    exports: [
        BranchService,
        BranchReviewService
    ],
    controllers: [branchController]
})
export class BranchModule {

}