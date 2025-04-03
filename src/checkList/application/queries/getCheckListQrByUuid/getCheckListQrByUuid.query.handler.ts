import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CheckListService } from '../../services/checkList.service';
import { CheckListDto } from '../../dtos/CheckList.dto';
import { GetCheckListQrByUuidQuery } from './getCheckListQrByUuid.query';
import * as QRCode from 'qrcode';

@QueryHandler(GetCheckListQrByUuidQuery)
export class GetCheckListQrByUuidQueryHandler implements IQueryHandler<GetCheckListQrByUuidQuery> {
    constructor(
        private checkListService: CheckListService
    ) { }

    async execute(query: GetCheckListQrByUuidQuery) {
        const checkList = await this.checkListService.getCheckListByUuid(query.uuid);

        if (!checkList) return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');

        const response = await QRCode.toDataURL('https://dev.d2tyv9oxqc639r.amplifyapp.com/checklist/'+checkList.uuid);
        return WsResponse.buildOkResponse(response);
    }
}
