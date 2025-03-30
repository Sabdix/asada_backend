import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteScheduleCommand } from './DeleteSchedule.command';
import { ScheduleService } from '../../services/schedule.service';

@CommandHandler(DeleteScheduleCommand)
export class DeleteScheduleCommandHandler implements ICommandHandler<DeleteScheduleCommand> {
    constructor(private readonly scheduleService: ScheduleService) { }

    async execute(command: DeleteScheduleCommand): Promise<WsResponse<null | string>> {
        const schedule = await this.scheduleService.getScheduleByUuid(command.uuid);

        if (!schedule)
            return WsResponse.buildNotFoundResponse('SCHEDULE NOT FOUND');

        await this.scheduleService.deleteSchedule(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
