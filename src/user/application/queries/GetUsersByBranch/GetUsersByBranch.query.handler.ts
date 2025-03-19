import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';
import { GetUsersByBranchQuery } from './GetUsersByBranch.query';
import { BranchService } from 'src/branch/application/services/Branch.service';

@QueryHandler(GetUsersByBranchQuery)
export class GetUsersByBranchQueryHandler implements IQueryHandler<GetUsersByBranchQuery> {
    constructor(
        private userService: UserService,
        private brancService: BranchService
    ) { }

    async execute(query: GetUsersByBranchQuery): Promise<WsResponse<UserDto[] | string>> {

        const branch = await this.brancService.getBranchByUuid(query.uuid);
        if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        const users = await this.userService.getUsersByBranch(branch.uuid);

        return WsResponse.buildOkResponse(
            plainToInstance(UserDto, users, { excludeExtraneousValues: true }),
        );
    }
}
