import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListHistoryService } from '../../services/checkListHistory.service';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { GetCheckListHistoryByUserAndGroupQuery } from './getCheckListHistoryByUserAndGroup.query';
import { UserService } from 'src/user/application/services/user.service';
import { CheckListGroupService } from '../../services/checkListGroup.service';

@QueryHandler(GetCheckListHistoryByUserAndGroupQuery)
export class GetCheckListHistoryByUserAndGroupQueryHandler
  implements IQueryHandler<GetCheckListHistoryByUserAndGroupQuery>
{
  constructor(
    private checkListHistoryService: CheckListHistoryService,
    private userService: UserService,
    private checkListGroupService: CheckListGroupService,
  ) {}

  async execute(query: GetCheckListHistoryByUserAndGroupQuery) {
    const user = await this.userService.getUserByUuid(query.uuidUser);
    if (!user) return WsResponse.buildNotFoundResponse('USER NOT FOUND');

    const group = await this.checkListGroupService.getCheckListGroupByUuid(
      query.uuidGroup,
    );
    if (!group) return WsResponse.buildNotFoundResponse('GROUP NOT FOUND');

    const checkListHistory =
      await this.checkListHistoryService.getCheckListHistoryByUserAndGroup(
        query.uuidUser,
        query.uuidGroup,
      );

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListHistoryDto, checkListHistory, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
