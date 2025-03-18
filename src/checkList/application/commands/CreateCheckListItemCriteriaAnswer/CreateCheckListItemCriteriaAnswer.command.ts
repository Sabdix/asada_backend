import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListItemCriteriaAnswerDto } from '../../dtos/CheckListItemCriteriaAnswer.dto';
import { CreateCheckListItemCriteriaAnswerRequestDto } from '../../dtos/CreateCheckListItemCriteriaAnswerRequestDto';


export class CreateCheckListItemCriteriaAnswerCommand extends Command<WsResponse< CheckListItemCriteriaAnswerDto | string>> {
  constructor(public body: CreateCheckListItemCriteriaAnswerRequestDto) {
    super();
  }
}
