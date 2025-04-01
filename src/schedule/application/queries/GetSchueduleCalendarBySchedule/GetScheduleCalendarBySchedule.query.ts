import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ScheduleCalendarDto } from '../../dtos/ScheduleCalendar.dto';

export class GetScheduleCalendarByScheduleQuery extends Query<WsResponse<ScheduleCalendarDto[] | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
