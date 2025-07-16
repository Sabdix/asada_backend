import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ReviewCheckListHistoryDto } from '../../dtos/ReviewCheckListHistory.dto';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';


export class ReviewCheckListHistoryCommand extends Command<WsResponse<CheckListHistoryDto | string>> {
    constructor(public readonly uuid: string, public readonly request: ReviewCheckListHistoryDto) {
        super();
    }
}
