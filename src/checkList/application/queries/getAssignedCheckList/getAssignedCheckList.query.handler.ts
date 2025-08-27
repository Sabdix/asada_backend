import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserService } from '../../services/checkListUser.service';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';
import { plainToInstance } from 'class-transformer';
import { GetAssignedCheckListQuery } from './getAssignedCheckList.query';

@QueryHandler(GetAssignedCheckListQuery)
export class GetAssignedCheckListQueryHandler
  implements IQueryHandler<GetAssignedCheckListQuery>
{
  constructor(private checkListUserService: CheckListUserService) {}

  async execute(query: GetAssignedCheckListQuery) {
    const [checkListUser, total] =
      await this.checkListUserService.getAllUserCheckListPaginated(
        query.size,
        query.offset,
        query.name,
        query.lastName,
        query.secondLastName,
        query.checkList,
        query.weekday,
      );

    return WsResponse.buildOkListResponse(
      plainToInstance(CheckListUserDto, checkListUser, {
        excludeExtraneousValues: true,
      }),
      total,
    );
  }
}
