import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListGroupDto } from '../../dtos/CheckListGroup.dto';
import { UpdateCheckListGroupRequestDto } from '../../dtos/UpdateCheckListGroup.dto';

export class UpdateCheckListGroupCommand extends Command<
  WsResponse<CheckListGroupDto | string>
> {
  constructor(
    public readonly body: UpdateCheckListGroupRequestDto,
    public readonly uuid: string,
  ) {
    super();
  }
}
