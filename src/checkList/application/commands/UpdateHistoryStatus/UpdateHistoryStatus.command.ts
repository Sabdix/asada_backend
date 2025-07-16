import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { UpdateHistoryStatusRequestDto } from '../../dtos/UpdateHistoryStatusRequest.dto';


export class UpdateHistoryStatusCommand extends Command<WsResponse<CheckListHistoryDto | string>> {
    constructor(public readonly uuid: string, public readonly request: UpdateHistoryStatusRequestDto) {
        super();
    }
}
