import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CreateScheduleCalendarCommand } from './CreateScheduleCalendar.command';
import { ScheduleCalendarDto } from '../../dtos/ScheduleCalendar.dto';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleCalendar } from 'src/schedule/domain/entities/ScheduleCalendar.entity';
import { ScheduleCalendarService } from '../../services/scheduleCalendar.service';

@CommandHandler(CreateScheduleCalendarCommand)
export class CreateScheduleCalendarCommandHandler implements ICommandHandler<CreateScheduleCalendarCommand> {
    constructor(
        private scheduleCalendarService: ScheduleCalendarService,
        private scheduleService: ScheduleService
    ) { }

    async execute(command: CreateScheduleCalendarCommand): Promise<WsResponse<ScheduleCalendarDto[] | string>> {

        const schedule = await this.scheduleService.getScheduleByUuid(command.uuid);
        if (!schedule)
            return WsResponse.buildNotFoundResponse('SCHEDULE NOT FOUND');

        const scheduleCalendarArray = new Array<ScheduleCalendar>

        for (const weekDay of command.body.weekDay) {
            const ScheduleCalendar = await this.scheduleCalendarService.creteScheduleCalendar(command.body, weekDay, command.uuid)

            scheduleCalendarArray.push(ScheduleCalendar)
        }

        return WsResponse.buildOkResponse(
            plainToInstance(ScheduleCalendarDto, scheduleCalendarArray, { excludeExtraneousValues: true }));
    }
}
