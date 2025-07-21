import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UserService } from '../../services/user.service';
import { UserDto } from '../../dtos/User.dto';
import { ScheduleService } from 'src/schedule/application/services/schedule.service';
import { AssignWorkAreaCommand } from './AssignWorkArea.command';
import { WorkAreaService } from '../../services/workArea.service';

@CommandHandler(AssignWorkAreaCommand)
export class AssignWorkAreaCommandHandler implements ICommandHandler<AssignWorkAreaCommand> {
    constructor(
        private userService: UserService,
        private workAreaService: WorkAreaService
    ) { }

    async execute(command: AssignWorkAreaCommand): Promise<WsResponse<UserDto | string>> {

        const user = await this.userService.getUserByUuid(command.uuid);
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        const workArea = await this.workAreaService.getWorkAreaByUuid(command.body.uuid_work_area);
        if (!workArea)
            return WsResponse.buildNotFoundResponse('WORK_AREA NOT FOUND');

        user.uuid_work_area = workArea.uuid
        user.workArea = workArea
        await this.userService.UpdateUser(user);

        return WsResponse.buildOkResponse(
              plainToInstance(UserDto, user, { excludeExtraneousValues: true }));
    }
}
