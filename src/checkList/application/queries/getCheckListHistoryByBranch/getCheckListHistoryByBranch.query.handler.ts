import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { GetCheckListHistoryByBranchQuery } from './getCheckListHistoryByBranch.query';
import { BranchService } from 'src/branch/application/services/Branch.service';

@QueryHandler(GetCheckListHistoryByBranchQuery)
export class GetCheckListHistoryByBranchQueryHandler implements IQueryHandler<GetCheckListHistoryByBranchQuery> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private branchService: BranchService
    ) { }

    async execute(query: GetCheckListHistoryByBranchQuery) {

        const branch = await this.branchService.getBranchByUuid(query.uuid);
        if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        const checkListHistory = await this.checkListHistoryService.getCheckListHistoryByBranch(query.uuid);

        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, checkListHistory, { excludeExtraneousValues: true }),
        );
    }
}
