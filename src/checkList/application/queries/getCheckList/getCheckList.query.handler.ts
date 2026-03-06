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
  ) { }

  async execute(query: GetCheckListQuery): Promise<WsResponse<CheckListDto[]>> {
    const checkList = await this.checkService.getCheckListPaginated(query.name, query.uuid);
    const checkListDto = plainToInstance(CheckListDto, checkList, { excludeExtraneousValues: true });
    
    return WsResponse.buildOkResponse(checkListDto);
  }
}
