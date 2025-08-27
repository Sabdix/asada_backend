import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetAssignedGroupedCheckListQuery } from './GetAssignedGroupedCheckList.query';
import { CheckListUserService } from '../../services/checkListUser.service';
import { plainToInstance } from 'class-transformer';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';

@QueryHandler(GetAssignedGroupedCheckListQuery)
export class GetAssignedGroupedCheckListQueryHandler
  implements IQueryHandler<GetAssignedGroupedCheckListQuery>
{
  constructor(private checkListUserService: CheckListUserService) {}

  async execute(query: GetAssignedGroupedCheckListQuery): Promise<any> {
    const { data, total } =
      await this.checkListUserService.getAllUserCheckListGroupedPaginated(
        query.size,
        query.offset,
        query.name,
        query.checkList,
        query.weekday,
      );
    const checkListUserDtos = data.map(e => {
        const checkListUserDto = new CheckListUserDto();
        checkListUserDto.uuid = e.uuid;
        checkListUserDto.uuid_user = e.userUuid;
        checkListUserDto.endHour = e.clu_endHour;
        checkListUserDto.initHour = e.clu_initHour;
        checkListUserDto.checkList = {
            uuid: e.checkListUuid,
            name: e.checkListName
        };
        checkListUserDto.user = {
            uuid: e.userUuid,
            name: e.userName,
            last_name: e.userLastName,
            second_last_name: e.userSecondLastName,
        };
        checkListUserDto.weekDays = e.weekDays
        return checkListUserDto;
    })
    return WsResponse.buildOkListResponse(
      checkListUserDtos,
      total,
    );
  }
}
