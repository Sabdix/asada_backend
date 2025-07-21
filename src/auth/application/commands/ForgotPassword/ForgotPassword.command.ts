import { Command } from '@nestjs/cqrs';
import { ForgotPasswordRequestDto } from 'src/auth/infrastructure/dtos/ForgotPaswordRequest.dto';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';


export class ForgotPasswordCommand extends Command<WsResponse<null | string>> {
    constructor(public readonly uuid: string, public readonly body: ForgotPasswordRequestDto) {
        super();
    }
}
