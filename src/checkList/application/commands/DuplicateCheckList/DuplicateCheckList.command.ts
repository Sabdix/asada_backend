import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DuplicateCheckListRequestDto } from '../../dtos/DuplicateCheckListRequest.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';


export class DuplicateCheckListCommand extends Command<WsResponse< CheckListDto | string>> {
  constructor(public body: DuplicateCheckListRequestDto) {
    super();
  }
}
