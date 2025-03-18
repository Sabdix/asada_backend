import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListItemCriteriaAnswerDto } from '../../dtos/CheckListItemCriteriaAnswer.dto';

export class GetCriteriaAnswerByCriteriaQuery extends Query<WsResponse<CheckListItemCriteriaAnswerDto[]| string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
