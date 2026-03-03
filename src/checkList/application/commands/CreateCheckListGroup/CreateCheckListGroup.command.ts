import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateCheckListGroupRequestDto } from '../../dtos/CreateCheckListGroup.dto';
import { CheckListGroupDto } from '../../dtos/CheckListGroup.dto';

export class CreateCheckListGroupCommand extends Command<
  WsResponse<CheckListGroupDto | string>
> {
  constructor(public body: CreateCheckListGroupRequestDto) {
    super();
  }
}
