import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListService } from '../../services/checkList.service';
import { GetCheckListQrByUuidQuery } from './getCheckListQrByUuid.query';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';

@QueryHandler(GetCheckListQrByUuidQuery)
export class GetCheckListQrByUuidQueryHandler implements IQueryHandler<GetCheckListQrByUuidQuery> {
    constructor(
        private checkListService: CheckListService,
        private readonly configService: ConfigService
    ) { }

    async execute(query: GetCheckListQrByUuidQuery) {
        const checkList = await this.checkListService.getCheckListByUuid(query.uuid);

        if (!checkList) return WsResponse.buildNotFoundResponse('CHECKLIST NOT FOUND');
        const urlBase = this.configService.get<string>('BASE_URL_QRS');
        const response = await QRCode.toDataURL(urlBase + checkList.uuid);
        
        return WsResponse.buildOkResponse(response);
    }
}
