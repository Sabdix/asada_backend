import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListQuery } from './getCheckList.query';
import { CheckListService } from '../../services/checkList.service';
import { CheckListDto } from '../../dtos/CheckList.dto';
import { CheckListItemService } from '../../services/checkListItem.service';

@QueryHandler(GetCheckListQuery)
export class GetCheckListQueryHandler implements IQueryHandler<GetCheckListQuery> {
  constructor(
    private checkService: CheckListService,
    private checkListItemService: CheckListItemService
  ) { }

  async execute(query: GetCheckListQuery): Promise<WsResponse<CheckListDto[]>> {
    const [checkList, total] = await this.checkService.getCheckListPaginated(query.size, query.offset, query.name);

    return WsResponse.buildOkListResponse(
      plainToInstance(CheckListDto, checkList, { excludeExtraneousValues: true }), total
    );
  }
}
