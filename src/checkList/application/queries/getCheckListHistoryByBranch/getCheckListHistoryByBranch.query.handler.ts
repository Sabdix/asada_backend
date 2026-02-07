import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { GetCheckListHistoryByBranchQuery } from './getCheckListHistoryByBranch.query';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';
import { StockHistoryService } from 'src/stock/application/services/StockHistory.service';

@QueryHandler(GetCheckListHistoryByBranchQuery)
export class GetCheckListHistoryByBranchQueryHandler implements IQueryHandler<GetCheckListHistoryByBranchQuery> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private branchService: BranchService,
        private stockHistory: StockHistoryService
    ) { }

    async execute(query: GetCheckListHistoryByBranchQuery) {

        const branch = await this.branchService.getBranchByUuid(query.uuid);
        if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        const [checkListHistory, total] = await this.checkListHistoryService.getCheckListHistoryByBranchPaginated(query.uuid, query.size, query.offset, query.name, query.lastName, query.secondLastName, query.checkList, query.branch);
        var response = new Array<CheckListHistoryDto>

        for (let history of checkListHistory) {
            var responseElement = new CheckListHistoryDto()
            if (history) {
                responseElement.approved = history.approved
                responseElement.comment = history.comment
                responseElement.date = history.date
                responseElement.managerApproved = history.managerApproved
                responseElement.status = history.status
                responseElement.managerRevised = history.managerRevised
                responseElement.revised = history.revised
                responseElement.user = history.user
                responseElement.managerComment = history.managerComment
                responseElement.uuid = history.uuid
                responseElement.check_list_user = new CheckListUserDto()
                responseElement.check_list_user.uuid = history.check_list_user.uuid
                responseElement.check_list_user.uuid_user = history.check_list_user.uuid_user
                responseElement.check_list_user.uuid_check_list = history.check_list_user.uuid_check_list
                responseElement.check_list_user.weekDay = history.check_list_user.weekDay
                responseElement.check_list_user.initHour = history.check_list_user.initHour
                responseElement.check_list_user.specialEvent = history.check_list_user.specialEvent
                responseElement.check_list_user.checkList = history.check_list_user.checkList
                responseElement.check_list_user.checkList = new CheckListDto()
                responseElement.check_list_user.checkList = history.check_list_user.checkList
            }
            if (history?.check_list_user.checkList.name.includes("Stock")) {
                const stockHistory = await this.stockHistory.getTodayStockHistoryByUser(history?.uuid_user, history.check_list_user?.checkList?.uuid)
                responseElement.stockHistory = stockHistory
            }
            response.push(responseElement)
        }

        return WsResponse.buildOkListResponse(
            plainToInstance(CheckListHistoryDto, response, { excludeExtraneousValues: true }), total
        );
    }
}
