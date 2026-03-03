import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListGroupByUuidQuery } from './GetCheckListGroupByUuid.query';
import { CheckListGroupService } from '../../services/checkListGroup.service';
import { CheckListGroupDto } from '../../dtos/CheckListGroup.dto';
import { CheckListGroupCheckListService } from '../../services/checkListGroupCheckList.service';

@QueryHandler(GetCheckListGroupByUuidQuery)
export class GetCheckListGroupByUuidQueryHandler
  implements IQueryHandler<GetCheckListGroupByUuidQuery>
{
  constructor(
    private checkListGroupService: CheckListGroupService,
    private checkListGroupCheckListService: CheckListGroupCheckListService,
  ) {}

  async execute(
    query: GetCheckListGroupByUuidQuery,
  ): Promise<WsResponse<CheckListGroupDto | string>> {
    const checkListGroup =
      await this.checkListGroupService.getCheckListGroupByUuid(query.uuid);

    if (!checkListGroup)
      return WsResponse.buildNotFoundResponse('GROUP NOT FOUND');

    // Get relations
    const relations =
      await this.checkListGroupCheckListService.getByGroupUuid(query.uuid);

    const result = {
      ...checkListGroup,
      checkLists: relations.map((rel) => ({
        uuid_check_list: rel.uuid_check_list,
        priority: rel.priority,
        checkListName: rel.checkList?.name,
      })),
    };

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListGroupDto, result, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
