import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetAssignedCheckListQuery } from './GetAssignedCheckList.query';
import { CheckListUserService } from 'src/checkList/application/services/checkListUser.service';
import { UserService } from '../../services/user.service';
import { CheckListUserDto } from 'src/checkList/application/dtos/CheckListUser.dto';

@QueryHandler(GetAssignedCheckListQuery)
export class GetAssignedCheckListQueryHandler implements IQueryHandler<GetAssignedCheckListQuery> {
  constructor(
    private checkListUserService: CheckListUserService,
    private userService: UserService
) {}

  async execute(query: GetAssignedCheckListQuery) {
    const user = await this.userService.getUserByUuid(query.uuid);

    if (!user) return WsResponse.buildNotFoundResponse('USER NOT FOUND');

    const userCheckList = await this.checkListUserService.getUserCheckList(query.uuid)
    
    return WsResponse.buildOkResponse(
      plainToInstance(CheckListUserDto, userCheckList, { excludeExtraneousValues: true }),
    );
  }
}
