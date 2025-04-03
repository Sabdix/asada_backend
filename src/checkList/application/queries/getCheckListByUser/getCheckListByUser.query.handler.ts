import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as QRCode from 'qrcode';
import { GetCheckListByUserQuery } from './getCheckListByUser.query';
import { CheckListUserService } from '../../services/checkListUser.service';
import { CheckListUserDto } from '../../dtos/CheckListUser.dto';
import { plainToInstance } from 'class-transformer';

@QueryHandler(GetCheckListByUserQuery)
export class GetCheckListByUserQueryHandler implements IQueryHandler<GetCheckListByUserQuery> {
    constructor(
        private checkListUserService: CheckListUserService
    ) { }

    async execute(query: GetCheckListByUserQuery) {
        const checkListUser = await this.checkListUserService.getUserCheckList(query.uuid);

       
        return WsResponse.buildOkResponse(
            plainToInstance(CheckListUserDto, checkListUser, { excludeExtraneousValues: true }),
        );
    }
}
