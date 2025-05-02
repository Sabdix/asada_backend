import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateCheckListRequestDto } from '../../dtos/CreateCheckList.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';
import { GetCriteriaAnswerByCriteriaQuery } from '../../queries/getCriteriaAnswerByCriteria/getCriteriaAnswerByCriteria.query';
import { CreateCheckListUserAnswerRequest } from '../../dtos/CreateCheckListUserAnswerRequest.dto';


export class AnswerCheckListCommand extends Command<WsResponse< object | string>> {
  constructor(public body: CreateCheckListUserAnswerRequest, public uuid_user: string) {
    super();
  }
}
