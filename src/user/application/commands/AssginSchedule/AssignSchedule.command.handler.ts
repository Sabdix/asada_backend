import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';
import { AssignScheduleCommand } from './AssignSchedule.command';
import { ScheduleService } from 'src/schedule/application/services/schedule.service';

@CommandHandler(AssignScheduleCommand)
export class AssignScheduleCommandHandler implements ICommandHandler<AssignScheduleCommand> {
    constructor(
        private userService: UserService,
        private scheduleService: ScheduleService
    ) { }

    async execute(command: AssignScheduleCommand): Promise<WsResponse<UserDto | string>> {

        const user = await this.userService.getUserByUuid(command.uuid);
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        const schedule = await this.scheduleService.getScheduleByUuid(command.body.uuid_schedule);
        if (!schedule)
            return WsResponse.buildNotFoundResponse('SCHEDULE NOT FOUND');

        user.uuid_user = schedule.uuid
        user.schedule = schedule

        await this.userService.UpdateUser(user);

        return WsResponse.buildOkResponse(
              plainToInstance(UserDto, user, { excludeExtraneousValues: true }));
        //return WsResponse.buildOkResponse(null);
    }
}
