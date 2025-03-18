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

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([Branch])
    ],
    providers: [
        BranchRepository,
        BranchService,
        CreateBranchCommandHandler,
        GetBranchByUuidQueryHandler,
        GetBranchesQueryHandler,
        DeleteBranchCommandHandler,
        UpdateBranchCommandHandler
    ],
    exports: [
        BranchService
    ],
    controllers: [branchController]
})
export class BranchModule {

}