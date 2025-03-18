import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateCheckListItemCriteriaRequestDto } from '../../dtos/CreateCheckListItemCriteriaRequest.dto';
import { CheckListItemCriteriaDto } from '../../dtos/CheckListItemCriteria.dto';


export class CreateCheckListItemCriteriaCommand extends Command<WsResponse< CheckListItemCriteriaDto | string>> {
  constructor(public body: CreateCheckListItemCriteriaRequestDto) {
    super();
  }
}
