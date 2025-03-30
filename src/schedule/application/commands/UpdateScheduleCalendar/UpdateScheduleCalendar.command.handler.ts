import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateScheduleCalendarCommand } from './UpdateScheduleCalendar.command';
import { ScheduleCalendarService } from '../../services/scheduleCalendar.service';
import { ScheduleCalendarDto } from '../../dtos/ScheduleCalendar.dto';

@CommandHandler(UpdateScheduleCalendarCommand)
export class UpdateScheduleCalendarCommandHandler implements ICommandHandler<UpdateScheduleCalendarCommand> {
    constructor(
        private scheduleCalendarService: ScheduleCalendarService,
    ) { }

    async execute(command: UpdateScheduleCalendarCommand): Promise<WsResponse<ScheduleCalendarDto | string>> {

        const scheduleCalendar = await this.scheduleCalendarService.getScheduleCalendarByUuid(command.uuid);
        if (!scheduleCalendar)
            return WsResponse.buildNotFoundResponse('SCHEDULE_CALENDAR NOT FOUND');

        scheduleCalendar.weekDay = command.body.weekDay ?? scheduleCalendar.weekDay;
        scheduleCalendar.endHour = command.body.endHour ?? scheduleCalendar.endHour;
        scheduleCalendar.initHour = command.body.initHour ?? scheduleCalendar.initHour;
        scheduleCalendar.mealHourNumber = command.body.mealHourNumber ?? scheduleCalendar.mealHourNumber;

        await this.scheduleCalendarService.UpdateScheduleCalendar(scheduleCalendar);

        return WsResponse.buildOkResponse(
            plainToInstance(ScheduleCalendarDto, scheduleCalendar, { excludeExtraneousValues: true }),
        );
    }
}
