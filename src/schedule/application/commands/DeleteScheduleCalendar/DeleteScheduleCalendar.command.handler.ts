import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteScheduleCalendarCommand } from './DeleteScheduleCalendar.command';
import { ScheduleCalendarService } from '../../services/scheduleCalendar.service';

@CommandHandler(DeleteScheduleCalendarCommand)
export class DeleteScheduleCalendarCommandHandler implements ICommandHandler<DeleteScheduleCalendarCommand> {
    constructor(private readonly scheduleCalendarService: ScheduleCalendarService) { }

    async execute(command: DeleteScheduleCalendarCommand): Promise<WsResponse<null | string>> {
        const scheduleCalendar = await this.scheduleCalendarService.getScheduleCalendarByUuid(command.uuid);

        if (!scheduleCalendar)
            return WsResponse.buildNotFoundResponse('SCHEDULE_CALENDAR NOT FOUND');

        await this.scheduleCalendarService.deleteScheduleCalendar(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
