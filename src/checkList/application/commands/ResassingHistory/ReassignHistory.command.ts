import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';
import { ReassignHistoryRequestDto } from '../../dtos/ReassignHistoryRequest.dto';


export class ReassignHistoryCommand extends Command<WsResponse<CheckListHistoryDto | string>> {
    constructor(public readonly uuid: string, public readonly request: ReassignHistoryRequestDto) {
        super();
    }
}
