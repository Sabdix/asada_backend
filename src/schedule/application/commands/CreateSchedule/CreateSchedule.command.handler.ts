import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CreateScheduleCommand } from './CreateSchedule.command';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleCalendarService } from '../../services/scheduleCalendar.service';
import { CalendarDto } from '../../dtos/Calendar.dto';

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleCommandHandler implements ICommandHandler<CreateScheduleCommand> {
  constructor(
    private scheduleService: ScheduleService,
    private scheduleCalendarService: ScheduleCalendarService,
  ) {}

  async execute(command: CreateScheduleCommand): Promise<WsResponse<ScheduleDto | string>> {

    if (await this.scheduleService.getScheduleByName(command.body.name))
        return WsResponse.buildConflictResponse('YA EXISTE UN HORARIO CON ESE NOMBRE','SCHEDULE ALREADY EXISTS');

    const schedule = await this.scheduleService.creteSchedule(command.body)
    const response = new ScheduleDto

    response.name = schedule.name
    response.uuid = schedule.uuid
    response.cheduleCalendar = new Array<CalendarDto>

    for(const calendar of command.body.calendars ){
      const scheduleCalendar = await this.scheduleCalendarService.creteSingleScheduleCalendar(calendar, schedule.uuid)
      const calendarDto = new CalendarDto

      calendarDto.endHour = scheduleCalendar.endHour
      calendarDto.initHour = scheduleCalendar.initHour
      calendarDto.uuid = scheduleCalendar.uuid
      calendarDto.mealHourNumber = scheduleCalendar.mealHourNumber
      calendarDto.weekDay = scheduleCalendar.weekDay

      response.cheduleCalendar.push(calendarDto)
    }

    return WsResponse.buildOkResponse(
      plainToInstance(ScheduleDto, response, { excludeExtraneousValues: true }),
    );
  }
}
