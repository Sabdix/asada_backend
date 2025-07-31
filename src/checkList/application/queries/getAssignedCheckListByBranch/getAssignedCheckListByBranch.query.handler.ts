import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserService } from '../../services/checkListUser.service';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';
import { plainToInstance } from 'class-transformer';
import { GetAssignedCheckListByBranchQuery } from './getAssignedCheckListByBranch.query';
import { BranchService } from 'src/branch/application/services/Branch.service';

@QueryHandler(GetAssignedCheckListByBranchQuery)
export class GetAssignedCheckListByBranchQueryHandler implements IQueryHandler<GetAssignedCheckListByBranchQuery> {
    constructor(
        private checkListUserService: CheckListUserService,
        private branchService: BranchService
    ) { }

    async execute(query: GetAssignedCheckListByBranchQuery) {

        const branch = await this.branchService.getBranchByUuid(query.uuid);
        if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        const [checkListUser, total] = await this.checkListUserService.getUserCheckListByBranch(branch.uuid, query.size, query.offset);

        return WsResponse.buildOkListResponse(
            plainToInstance(CheckListUserDto, checkListUser, { excludeExtraneousValues: true }),total
        );
    }
}
