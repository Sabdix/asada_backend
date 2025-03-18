import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';

export class GetItemCriteriaByItemQuery extends Query<WsResponse<CheckListItemCriteriaDto[]| string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
