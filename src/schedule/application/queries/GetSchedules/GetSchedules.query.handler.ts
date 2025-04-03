import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetSchedulesQuery } from './GetSchedules.query';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleCalendarService } from '../../services/scheduleCalendar.service';

@QueryHandler(GetSchedulesQuery)
export class GetSchedulesQueryHandler implements IQueryHandler<GetSchedulesQuery> {
  constructor(
    private scheduleService: ScheduleService,
    private scheduleCalendarService: ScheduleCalendarService
  ) { }

  async execute(): Promise<WsResponse<ScheduleDto[]>> {
    const schedules = await this.scheduleService.getScheudules();

    const response = new Array<ScheduleDto>

    for (const schedule of schedules) {
      const scheduleWithCalendar = new ScheduleDto

      scheduleWithCalendar.name = schedule.name
      scheduleWithCalendar.uuid = schedule.uuid

      scheduleWithCalendar.cheduleCalendar = await this.scheduleCalendarService.getScheduleCalendarBySchedule(schedule.uuid)

      response.push(scheduleWithCalendar)
    }

    return WsResponse.buildOkResponse(
      plainToInstance(ScheduleDto, response, { excludeExtraneousValues: true }),
    );
  }
}
