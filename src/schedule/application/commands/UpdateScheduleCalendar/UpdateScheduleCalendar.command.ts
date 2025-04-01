import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ScheduleCalendarDto } from '../../dtos/ScheduleCalendar.dto';
import { UpdateScheduleCalendarRequestDto } from '../../dtos/UpdateScheduleCalendarRequest.dto';


export class UpdateScheduleCalendarCommand extends Command<WsResponse<ScheduleCalendarDto | string>> {
  constructor(public readonly body: UpdateScheduleCalendarRequestDto, public readonly uuid: string
  ) {
    super();
  }
}
