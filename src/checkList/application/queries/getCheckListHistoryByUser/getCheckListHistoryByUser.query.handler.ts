import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { GetCheckListHistoryByUserQuery } from './getCheckListHistoryByUser.query';
import { UserService } from 'src/user/application/services/user.service';

@QueryHandler(GetCheckListHistoryByUserQuery)
export class GetCheckListHistoryByUserQueryHandler implements IQueryHandler<GetCheckListHistoryByUserQuery> {
    constructor(
        private checkListHistoryService: CheckListHistoryService,
        private userService: UserService
    ) { }

    async execute(query: GetCheckListHistoryByUserQuery) {

        const user = await this.userService.getUserByUuid(query.uuid)
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        const checkListHistory = await this.checkListHistoryService.getCheckListHistoryByUser(query.uuid);


        return WsResponse.buildOkResponse(
            plainToInstance(CheckListHistoryDto, checkListHistory, { excludeExtraneousValues: true }),
        );
    }
}
