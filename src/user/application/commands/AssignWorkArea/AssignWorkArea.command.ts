import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from '../../dtos/User.dto';
import { AssingWorkAreaRequestDto } from '../../dtos/AssignWorkAreaRequest.dto';

export class AssignWorkAreaCommand extends Command<WsResponse<UserDto | string>> {
    constructor(public body: AssingWorkAreaRequestDto, public uuid: string
    ) {
        super();
    }
}
