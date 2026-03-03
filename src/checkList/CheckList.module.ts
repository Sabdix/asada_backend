import { forwardRef, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { CheckList } from "./domain/entities/CheckList.entity";
import { CheckListGroup } from "./domain/entities/CheckListGroup.entity";
import { CheckListGroupCheckList } from "./domain/entities/CheckListGroupCheckList.entity";
import { CheckListController } from "./infrastructure/controllers/CheckList.controller";
import { CheckListGroupController } from "./infrastructure/controllers/CheckListGroup.controller";
import { CheckListService } from "./application/services/checkList.service";
import { CreateCheckListCommandHandler } from "./application/commands/CreateCheckList/CreateCheckList.command.handler";
import { GetCheckListByUuidQueryHandler } from "./application/queries/getCheckListByUuid/getCheckListByUuid.query.handler";
import { GetCheckListQueryHandler } from "./application/queries/getCheckList/getCheckList.query.handler";
import { UpdateCheckListCommandHandler } from "./application/commands/UpdateCheckList/UpdateCheckList.command.handler";
import { DeleteCheckListCommandHandler } from "./application/commands/DeleteCheckList/DeleteCheckList.command.handler";
import { CheckListRepository } from "./infrastructure/repositories/CheckList.Repository";
import { CheckListItemService } from "./application/services/checkListItem.service";
import { CheckListItem } from "./domain/entities/CheckListItem.entity";
import { CheckListItemRepository } from "./infrastructure/repositories/CheckListItem.Repository";
import { CreateCheckListItemCommandHandler } from "./application/commands/CreateCheckListItem/CreateCheckListItem.command.handler";
import { CheckListItemCriteria } from "./domain/entities/CheckListItemCriteria.entity";
import { CheckListItemCriteriaAnswers } from "./domain/entities/CheckListItemCriteriaAnswers.entity";
import { CheckListItemCriteriaService } from "./application/services/checkListItemCriteria.service";
import { CheckListItemCriteriaAnswerRepository } from "./infrastructure/repositories/CheckListItemCriteriaAnswer.Repository";
import { CheckListItemCriteriaAnswerService } from "./application/services/checkListItemCriteriaAnswer.service";
import { CreateCheckListItemCriteriaCommandHandler } from "./application/commands/CreateCheckListItemCriteria/CreateCheckListItemCriteria.command.handler";
import { CheckListItemCriteriaRepository } from "./infrastructure/repositories/CheckListItemCriteria.Repository";
import { CreateCheckListItemCriteriaAnswerCommandHandler } from "./application/commands/CreateCheckListItemCriteriaAnswer/CreateCheckListItemCriteriaAnswer.command.handler";
import { DeleteCheckListItemCommandHandler } from "./application/commands/DeleteCheckListItem/DeleteChecklistItem.command.handler";
import { DeleteCheckListItemCriteriaCommandHandler } from "./application/commands/DeleteCheckListItemCriteria/DeleteChecklistItemCriteria.command.handler";
import { DeleteCheckListItemCriteriaAnswerCommandHandler } from "./application/commands/DeleteCheckListItemCriteriaAnswer/DeleteChecklistItemCriteriaAnswer.command.handler";
import { UpdateCheckListItemCommandHandler } from "./application/commands/UpdateCheckListItem/UpdateCheckListItem.command.handler";
import { UpdateCheckListItemCriteriaCommandHandler } from "./application/commands/UpdateCheckListItemCriteria/UpdateCheckListItemCriteria.command.handler";
import { UpdateCheckListItemCriteriaAnswerCommandHandler } from "./application/commands/UpdateCheckListItemCriteriaAnswer/UpdateCheckListItemCriteriaAnswer.command.handler";
import { GetItemCriteriaByItemQueryHandler } from "./application/queries/getItemCriteriaByItem/getItemCriteriaByItem.query.handler";
import { GetCheckListItemsByCheckListQueryHandler } from "./application/queries/getCheckListItemsByCheckList/getCheckListItemsByCheckList.query.handler";
import { GetCriteriaAnswerByCriteriaQueryHandler } from "./application/queries/getCriteriaAnswerByCriteria/getCriteriaAnswerByCriteria.query.handler";
import { CheckListUser } from "./domain/entities/CheckListUser.entity";
import { CheckListUserRepository } from "./infrastructure/repositories/CheckListUser.Repository";
import { CheckListUserService } from "./application/services/checkListUser.service";
import { User } from "src/user/domain/entities/User.entity";
import { GetCheckListQrByUuidQueryHandler } from "./application/queries/getCheckListQrByUuid/getCheckListQrByUuid.query.handler";
import { DuplicateItemCommandHandler } from "./application/commands/DuplicateItem/DuplicateItem.command.handler";
import { GetCheckListByUserQueryHandler } from "./application/queries/getCheckListByUser/getCheckListByUser.query.handler";
import { GetAssignedCheckListQueryHandler } from "./application/queries/getAssignedCheckList/getAssignedCheckList.query.handler";
import { CheckListHistoryService } from "./application/services/checkListHistory.service";
import { CheckListHistoryRepository } from "./infrastructure/repositories/CheckListHistory.Repository";
import { CheckListHistory } from "./domain/entities/CheckListHistory";
import { AnswerCheckListCommandHandler } from "./application/commands/AnswerCheckList/AnswerCheckList.command.handler";
import { CheckListUserAnswersRepository } from "./infrastructure/repositories/CheckListUserAnswers.Repository";
import { CheckListUserAnswersService } from "./application/services/checkListUserAnswers.service";
import { CheckListUserAnswers } from "./domain/entities/CheckListUserAnswers";
import { UserModule } from "src/user/User.module";
import { GetCheckListHistoryQueryHandler } from "./application/queries/getCheckListHistory/getCheckListHistory.query.handler";
import { GetCheckListHistoryByUserQueryHandler } from "./application/queries/getCheckListHistoryByUser/getCheckListHistoryByUser.query.handler";
import { getCheckListHistoryAnswersByHistoryQueryHandler } from "./application/queries/getCheckListHistoryAnswersByHistory/getCheckListHistoryAnswersByHistory.query.handler";
import { UpdateHistoryStatusCommandHandler } from "./application/commands/UpdateHistoryStatus/UpdateHistoryStatus.command.handler";
import { DownloadCheckListHistoryReportQueryHandler } from "./application/queries/downloadCheckListHistoryReport/downloadCheckListHistoryReport.query.handler";
import { ReassignHistoryCommandHandler } from "./application/commands/ResassingHistory/ReassignHistory.command.handler";
import { GetAssignedCheckListByBranchQueryHandler } from "./application/queries/getAssignedCheckListByBranch/getAssignedCheckListByBranch.query.handler";
import { Branch } from "src/branch/domain/entities/Branch.entity";
import { BranchModule } from "src/branch/Branch.module";
import { GetCheckListHistoryByBranchQueryHandler } from "./application/queries/getCheckListHistoryByBranch/getCheckListHistoryByBranch.query.handler";
import { DuplicateCheckListCommandHandler } from "./application/commands/DuplicateCheckList/DuplicateCheckList.command.handler";
import { ReviewCheckListHistoryCommandHandler } from "./application/commands/ReviewCheckListHistory/ReviewCheckListHistory.command.handler";
import { GetCheckListHistoryByUuidQueryHandler } from "./application/queries/getCheckListHistoryByUuid/getCheckListHistoryByUuid.query.handler";
import { GetAssignedGroupedCheckListQueryHandler } from "./application/queries/getAssignedGroupedCheckList/GetAssignedGroupedCheckList.query.handler";
import { ManagerReviewCheckListHistoryCommandHandler } from "./application/commands/ManagerReviewCheckListHistory/ManagerReviewCheckList.command.handler";
import { GetCheckListHistoryByManagerQueryHandler } from "./application/queries/getCheckListHistoryByManager/getCheckListHistortByManager.query.handler";
import { GetCheckListHistoryByUserAndGroupQueryHandler } from "./application/queries/getCheckListHistoryByUserAndGroup/getCheckListHistoryByUserAndGroup.query.handler";
import { StockModule } from "src/stock/Stock.module";
import { CheckListGroupService } from "./application/services/checkListGroup.service";
import { CheckListGroupRepository } from "./infrastructure/repositories/CheckListGroup.Repository";
import { CheckListGroupCheckListService } from "./application/services/checkListGroupCheckList.service";
import { CheckListGroupCheckListRepository } from "./infrastructure/repositories/CheckListGroupCheckList.Repository";
import { CreateCheckListGroupCommandHandler } from "./application/commands/CreateCheckListGroup/CreateCheckListGroup.command.handler";
import { UpdateCheckListGroupCommandHandler } from "./application/commands/UpdateCheckListGroup/UpdateCheckListGroup.command.handler";
import { DeleteCheckListGroupCommandHandler } from "./application/commands/DeleteCheckListGroup/DeleteCheckListGroup.command.handler";
import { GetCheckListGroupsQueryHandler } from "./application/queries/GetCheckListGroups/GetCheckListGroups.query.handler";
import { GetCheckListGroupByUuidQueryHandler } from "./application/queries/GetCheckListGroupByUuid/GetCheckListGroupByUuid.query.handler";
import { GetCheckListGroupQrByUuidQueryHandler } from "./application/queries/GetCheckListGroupQrByUuid/GetCheckListGroupQrByUuid.query.handler";

@Module({
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forFeature([CheckList, CheckListGroup, CheckListGroupCheckList, CheckListItem, CheckListItemCriteria, CheckListItemCriteriaAnswers, CheckListUser, User, CheckListHistory, CheckListUserAnswers, Branch]),
        forwardRef(() => UserModule),
        BranchModule,
        StockModule
    ],
    providers: [
        CheckListService,
        CheckListRepository,
        CreateCheckListCommandHandler,
        GetCheckListByUuidQueryHandler,
        GetCheckListQueryHandler,
        UpdateCheckListCommandHandler,
        DeleteCheckListCommandHandler,
        GetCheckListQrByUuidQueryHandler,
        DuplicateItemCommandHandler,
        DuplicateCheckListCommandHandler,

        CheckListItemService,
        CheckListItemRepository,
        GetCheckListItemsByCheckListQueryHandler,
        CreateCheckListItemCommandHandler,
        DeleteCheckListItemCommandHandler,
        UpdateCheckListItemCommandHandler,

        CheckListItemCriteriaService,
        CheckListItemCriteriaRepository,
        GetItemCriteriaByItemQueryHandler,
        CreateCheckListItemCriteriaCommandHandler,
        DeleteCheckListItemCriteriaCommandHandler,
        UpdateCheckListItemCriteriaCommandHandler,

        CheckListItemCriteriaAnswerService,
        CheckListItemCriteriaAnswerRepository,
        GetCriteriaAnswerByCriteriaQueryHandler,
        CreateCheckListItemCriteriaAnswerCommandHandler,
        DeleteCheckListItemCriteriaAnswerCommandHandler,
        UpdateCheckListItemCriteriaAnswerCommandHandler,

        CheckListUserRepository,
        CheckListUserService,
        GetCheckListByUserQueryHandler,
        GetAssignedCheckListQueryHandler,

        CheckListHistoryRepository,
        CheckListHistoryService,
        GetCheckListHistoryQueryHandler,
        GetCheckListHistoryByUserQueryHandler,
        UpdateHistoryStatusCommandHandler,
        DownloadCheckListHistoryReportQueryHandler,
        ReassignHistoryCommandHandler,
        GetAssignedCheckListByBranchQueryHandler,
        GetCheckListHistoryByBranchQueryHandler,
        ReviewCheckListHistoryCommandHandler,
        GetCheckListHistoryByUuidQueryHandler,
        ManagerReviewCheckListHistoryCommandHandler,
        GetCheckListHistoryByManagerQueryHandler,
        GetCheckListHistoryByUserAndGroupQueryHandler,

        CheckListUserAnswersRepository,
        CheckListUserAnswersService,
        AnswerCheckListCommandHandler,
        getCheckListHistoryAnswersByHistoryQueryHandler,
        GetAssignedGroupedCheckListQueryHandler,

        CheckListGroupService,
        CheckListGroupRepository,
        CheckListGroupCheckListService,
        CheckListGroupCheckListRepository,
        CreateCheckListGroupCommandHandler,
        UpdateCheckListGroupCommandHandler,
        DeleteCheckListGroupCommandHandler,
        GetCheckListGroupsQueryHandler,
        GetCheckListGroupByUuidQueryHandler,
        GetCheckListGroupQrByUuidQueryHandler,
    ],
    exports: [
        CheckListService,
        CheckListItemService,
        CheckListItemCriteriaService,
        CheckListUserService,
        CheckListHistoryService,
        CheckListUserAnswersService,
        CheckListGroupService,
        CheckListGroupCheckListService,
    ],
    controllers: [CheckListController, CheckListGroupController]

})
export class CheckListModule {

}