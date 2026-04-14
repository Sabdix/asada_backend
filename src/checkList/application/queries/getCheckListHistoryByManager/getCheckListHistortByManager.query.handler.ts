import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { GetCheckListHistoryByManagerQuery } from './getCheckListHistoryByManager.query';
import { UserService } from 'src/user/application/services/user.service';
import { StockHistoryService } from 'src/stock/application/services/StockHistory.service';
import { response } from 'express';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';

@QueryHandler(GetCheckListHistoryByManagerQuery)
export class GetCheckListHistoryByManagerQueryHandler implements IQueryHandler<GetCheckListHistoryByManagerQuery> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private userService: UserService,
        private stockHistory: StockHistoryService
    ) { }

    async execute(query: GetCheckListHistoryByManagerQuery) {

        const manager = await this.userService.getUserByUuid(query.uuidManager);
        if (!manager) return WsResponse.buildNotFoundResponse('Manager NOT FOUND');

        const histories = await this.checkListHistoryService.getCheckListHistoyByCheckListAndManager(query.uuidCheckList, manager.uuid_branch)

        var response = new Array<CheckListHistoryDto>()
        for (const history of histories ){
            var historyItem = new CheckListHistoryDto
            if (history) {
                historyItem.approved = history.approved
                historyItem.status = history.status
                historyItem.comment = history.comment
                historyItem.date = history.date
                historyItem.managerApproved = history.managerApproved
                historyItem.comment = history.comment
                historyItem.managerRevised = history.managerRevised
                historyItem.revised = history.revised
                historyItem.user = history.check_list_user.user
                historyItem.managerComment = history.managerComment
                historyItem.uuid = history.uuid
                historyItem.check_list_user = new CheckListUserDto()
                historyItem.check_list_user.checkList = new  CheckListDto()
                historyItem.check_list_user.checkList = history.check_list_user.checkList
            }
            if (history?.check_list_user.checkList.name.includes("Stock")){
                const stockHistory = await this.stockHistory.getTodayStockHistoryByUser(history?.uuid_user, query.uuidCheckList)
                historyItem.stockHistory = stockHistory
            }
            response.push(historyItem)
        }   
            

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, response, { excludeExtraneousValues: true })
        );
    }
}
