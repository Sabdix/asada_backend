import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListGroupsQuery } from './GetCheckListGroups.query';
import { CheckListGroupService } from '../../services/checkListGroup.service';
import { CheckListGroupDto } from '../../dtos/CheckListGroup.dto';
import { CheckListGroupCheckListService } from '../../services/checkListGroupCheckList.service';

@QueryHandler(GetCheckListGroupsQuery)
export class GetCheckListGroupsQueryHandler
  implements IQueryHandler<GetCheckListGroupsQuery>
{
  constructor(
    private checkListGroupService: CheckListGroupService,
    private checkListGroupCheckListService: CheckListGroupCheckListService,
  ) {}

  async execute(
    query: GetCheckListGroupsQuery,
  ): Promise<WsResponse<CheckListGroupDto[]>> {
    const checkListGroups =
      await this.checkListGroupService.getCheckListGroups(query.name);

    // Get relations for each group
    const groupsWithRelations = await Promise.all(
      checkListGroups.map(async (group) => {
        const relations =
          await this.checkListGroupCheckListService.getByGroupUuid(group.uuid);
        return {
          ...group,
          checkLists: relations.map((rel) => ({
            uuid_check_list: rel.uuid_check_list,
            priority: rel.priority,
            checkListName: rel.checkList?.name,
          })),
        };
      }),
    );

    const checkListGroupsDto = plainToInstance(
      CheckListGroupDto,
      groupsWithRelations,
      { excludeExtraneousValues: true },
    );

    return WsResponse.buildOkResponse(checkListGroupsDto);
  }
}
