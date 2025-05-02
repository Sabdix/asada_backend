import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';


export class UpdateHistoryStatusCommand extends Command<WsResponse<CheckListHistoryDto | string>> {
    constructor(public readonly uuid: string) {
        super();
    }
}
