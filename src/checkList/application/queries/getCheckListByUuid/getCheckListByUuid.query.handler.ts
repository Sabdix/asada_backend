import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetCheckListByUuidQuery } from './getCheckListByUuid.query';
import { CheckListService } from '../../services/checkList.service';
import { CheckListDto } from '../../dtos/CheckList.dto';

@QueryHandler(GetCheckListByUuidQuery)
export class GetCheckListByUuidQueryHandler implements IQueryHandler<GetCheckListByUuidQuery> {
  constructor(private  checkService: CheckListService) {}

  async execute(query: GetCheckListByUuidQuery) {
    const checkList = await this.checkService.getCheckListByUuid(query.uuid);

    if (!checkList) return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(CheckListDto, checkList, { excludeExtraneousValues: true }),
    );
  }
}
