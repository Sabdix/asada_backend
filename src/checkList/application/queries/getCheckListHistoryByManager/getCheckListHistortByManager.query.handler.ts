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

        const history = await this.checkListHistoryService.getCheckListHistoyByCheckListAndManager(query.uuidCheckList, manager.uuid_branch)

        var response = new CheckListHistoryDto()
        if (history) {
            response.approved = history.approved
            response.comment = history.comment
            response.date = history.date
            response.managerApproved = history.managerApproved
            response.comment = history.comment
            response.managerRevised = history.managerRevised
            response.revised = history.revised
            response.user = history.check_list_user.user
            response.managerComment = history.managerComment
            response.uuid = history.uuid
            response.check_list_user = new CheckListUserDto()
            response.check_list_user.checkList = new  CheckListDto()
            response.check_list_user.checkList = history.check_list_user.checkList
        }
        if (history?.check_list_user.checkList.name.includes("Stock")){
            const stockHistory = await this.stockHistory.getTodayStockHistoryByUser(history?.uuid_user)
            response.stockHistory = stockHistory
        }


        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, response, { excludeExtraneousValues: true })
        );
    }
}
