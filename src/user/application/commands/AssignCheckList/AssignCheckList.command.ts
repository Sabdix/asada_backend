import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { AssingCheckListRequestDto } from '../../dtos/AssingCheckListRequest.dto';
import { CheckListUserDto } from 'src/checkList/application/dtos/CheckListUser.dto';

export class AssignCheckListCommand extends Command<WsResponse<CheckListUserDto[] | string>> {
    constructor(public body: AssingCheckListRequestDto, public uuid: string
    ) {
        super();
    }
}
