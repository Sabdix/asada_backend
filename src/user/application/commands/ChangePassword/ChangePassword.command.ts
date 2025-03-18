import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ChangePasswordRequestDto } from '../../dtos/ChangePasswordRequest.dto';


export class ChangePasswordCommand extends Command<WsResponse<null | string>> {
    constructor(public request: ChangePasswordRequestDto, public uuid: string) {
        super();
    }
}
