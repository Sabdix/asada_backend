import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateScheduleCalendarRequestDto } from '../../dtos/CreateScheduleCalendarRequest.dto';
import { ScheduleCalendarDto } from '../../dtos/ScheduleCalendar.dto';


export class CreateScheduleCalendarCommand extends Command<WsResponse< ScheduleCalendarDto[] | string>> {
  constructor(public readonly body: CreateScheduleCalendarRequestDto, public readonly uuid : string) {
    super();
  }
}
