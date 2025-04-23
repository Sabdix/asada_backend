import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import * as QRCode from 'qrcode';
import { GetBranchQrByUuidQuery } from './GetBranchQrByUuid.query';
import { BranchService } from '../../services/Branch.service';
import {  ConfigService } from '@nestjs/config';

@QueryHandler(GetBranchQrByUuidQuery)
export class GetBranchQrByUuidQueryHandler implements IQueryHandler<GetBranchQrByUuidQuery> {
    constructor(
        private branchService: BranchService,
        private readonly configService: ConfigService
    ) { }

    async execute(query: GetBranchQrByUuidQuery) {
        const branch = await this.branchService.getBranchByUuid(query.uuid);

        if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');
        const urlBase = this.configService.get<string>('BASE_URL_QRS'); 

        const response = await QRCode.toDataURL(urlBase+"branch/"+branch.uuid);
        return WsResponse.buildOkResponse(response);
    }
}
