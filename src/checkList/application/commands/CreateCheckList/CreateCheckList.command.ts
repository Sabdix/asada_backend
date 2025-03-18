import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateCheckListRequestDto } from '../../dtos/CreateCheckList.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';


export class CreateCheckListCommand extends Command<WsResponse< CheckListDto | string>> {
  constructor(public body: CreateCheckListRequestDto) {
    super();
  }
}
