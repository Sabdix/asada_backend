import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { UpdateScheduleRequestDto } from '../../dtos/UpdateScheduleRequest.dto';


export class UpdateScheduleCommand extends Command<WsResponse<ScheduleDto | string>> {
  constructor(public readonly body: UpdateScheduleRequestDto, public readonly uuid: string
  ) {
    super();
  }
}
