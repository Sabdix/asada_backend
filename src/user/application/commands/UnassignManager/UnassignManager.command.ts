import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserDto } from '../../dtos/User.dto';

export class UnassignManagerCommand extends Command<WsResponse<UserDto | string>> {
    constructor(public uuid: string
    ) {
        super();
    }
}
