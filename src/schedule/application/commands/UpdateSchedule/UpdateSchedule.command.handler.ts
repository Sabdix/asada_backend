import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateScheduleCommand } from './UpdateSchedule.command';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { ScheduleService } from '../../services/schedule.service';

@CommandHandler(UpdateScheduleCommand)
export class UpdateScheduleCommandHandler implements ICommandHandler<UpdateScheduleCommand> {
    constructor(
        private scheduleService: ScheduleService,
    ) { }

    async execute(command: UpdateScheduleCommand): Promise<WsResponse<ScheduleDto | string>> {

        const schedule = await this.scheduleService.getScheduleByUuid(command.uuid);
        if (!schedule)
            return WsResponse.buildNotFoundResponse('SCHEDULE NOT FOUND');

        schedule.name = command.body.name ?? schedule.name;

        await this.scheduleService.UpdateSchedule(schedule);

        return WsResponse.buildOkResponse(
            plainToInstance(ScheduleDto, schedule, { excludeExtraneousValues: true }),
        );
    }
}
