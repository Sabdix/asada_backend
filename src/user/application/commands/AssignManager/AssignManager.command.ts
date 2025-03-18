import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { AssingManagerRequestDto } from '../../dtos/AssignManagerRequest.dto';
import { UserDto } from '../../dtos/User.dto';

export class AssignManagerCommand extends Command<WsResponse<UserDto | string>> {
    constructor(public body: AssingManagerRequestDto, public uuid: string
    ) {
        super();
    }
}
