import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListDto } from '../../dtos/CheckList.dto';
import { UpdateCheckListRequestDto } from '../../dtos/UpdateCheckListRequest.dto';


export class UpdateCheckListCommand extends Command<WsResponse<CheckListDto | string>> {
    constructor(public readonly body: UpdateCheckListRequestDto, public readonly uuid: string) {
        super();
    }
}
