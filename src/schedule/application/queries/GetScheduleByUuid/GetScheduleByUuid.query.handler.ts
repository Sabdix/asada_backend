import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetScheduleByUuidQuery } from './GetScheduleByUuid.query';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { ScheduleCalendarService } from '../../services/scheduleCalendar.service';
import { CalendarDto } from '../../dtos/Calendar.dto';

@QueryHandler(GetScheduleByUuidQuery)
export class GetScheduleByUuidQueryHandler implements IQueryHandler<GetScheduleByUuidQuery> {
  constructor(
    private scheudleService: ScheduleService,
    private scheudleCalendarService: ScheduleCalendarService) { }

  async execute(query: GetScheduleByUuidQuery) {
    const schedule = await this.scheudleService.getScheduleByUuid(query.uuid);

    if (!schedule) return WsResponse.buildNotFoundResponse('SCHEDULE NOT FOUND');

    const calendars = await this.scheudleCalendarService.getScheduleCalendarBySchedule(schedule.uuid)

    const response = new ScheduleDto
    response.name = schedule.name
    response.uuid = schedule.uuid
    response.cheduleCalendar = new Array<CalendarDto>

    for (const calendar of calendars) {
      const calendardto = new CalendarDto
      calendardto.endHour = calendar.endHour
      calendardto.initHour = calendar.initHour
      calendardto.mealHourNumber = calendar.mealHourNumber
      calendardto.uuid = calendar.uuid
      calendardto.weekDay = calendar.weekDay

      response.cheduleCalendar.push(calendardto)
    }

    return WsResponse.buildOkResponse(
      plainToInstance(ScheduleDto, response, { excludeExtraneousValues: true }),
    );
  }
}
