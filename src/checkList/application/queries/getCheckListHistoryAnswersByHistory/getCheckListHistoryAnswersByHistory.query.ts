import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListUserAnswersDto } from '../../dtos/CheckListUserAnswers.dto';

export class getCheckListHistoryAnswersByHistoryQuery extends Query<WsResponse<CheckListUserAnswersDto[] | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
