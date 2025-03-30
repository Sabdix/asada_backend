import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from '../../dtos/User.dto';
import { AssingScheduleRequestDto } from '../../dtos/AssignScheduleRequest.dto';

export class AssignScheduleCommand extends Command<WsResponse<UserDto | string>> {
    constructor(public body: AssingScheduleRequestDto, public uuid: string
    ) {
        super();
    }
}
