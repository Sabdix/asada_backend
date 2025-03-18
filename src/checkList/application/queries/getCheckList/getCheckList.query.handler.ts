import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListQuery } from './getCheckList.query';
import { CheckListService } from '../../services/checkList.service';
import { CheckListDto } from '../../dtos/CheckList.dto';

@QueryHandler(GetCheckListQuery)
export class GetCheckListQueryHandler implements IQueryHandler<GetCheckListQuery> {
  constructor(private  checkService: CheckListService) {}

  async execute(): Promise<WsResponse<CheckListDto[]>> {
    const checkList = await this.checkService.getCheckList();

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListDto, checkList, { excludeExtraneousValues: true }),
    );
  }
}
