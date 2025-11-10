import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { GetCheckListHistoryByManagerQuery } from './getCheckListHistoryByManager.query';
import { UserService } from 'src/user/application/services/user.service';

@QueryHandler(GetCheckListHistoryByManagerQuery)
export class GetCheckListHistoryByManagerQueryHandler implements IQueryHandler<GetCheckListHistoryByManagerQuery> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private userService: UserService
    ) { }

    async execute(query: GetCheckListHistoryByManagerQuery) {

        const manager = await this.userService.getUserByUuid(query.uuidManager);
        if (!manager) return WsResponse.buildNotFoundResponse('Manager NOT FOUND');

        const history = await this.checkListHistoryService.getCheckListHistoyByCheckListAndManager(query.uuidCheckList, manager.uuid_branch)

        return WsResponse.buildOkResponse(
            plainToInstance( CheckListHistoryDto, history, { excludeExtraneousValues: true })
        );
    }
}
