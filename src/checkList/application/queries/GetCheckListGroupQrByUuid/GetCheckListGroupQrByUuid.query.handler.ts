import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListGroupService } from '../../services/checkListGroup.service';
import { GetCheckListGroupQrByUuidQuery } from './GetCheckListGroupQrByUuid.query';
import * as QRCode from 'qrcode';
import { ConfigService } from '@nestjs/config';

@QueryHandler(GetCheckListGroupQrByUuidQuery)
export class GetCheckListGroupQrByUuidQueryHandler
  implements IQueryHandler<GetCheckListGroupQrByUuidQuery>
{
  constructor(
    private checkListGroupService: CheckListGroupService,
    private readonly configService: ConfigService,
  ) {}

  async execute(query: GetCheckListGroupQrByUuidQuery) {
    const checkListGroup =
      await this.checkListGroupService.getCheckListGroupByUuid(query.uuid);

    if (!checkListGroup)
      return WsResponse.buildNotFoundResponse('GROUP NOT FOUND');

    const urlBase = this.configService.get<string>('BASE_URL_QRS');
    const response = await QRCode.toDataURL(
      urlBase + 'checklist-group/' + checkListGroup.uuid,
    );

    return WsResponse.buildOkResponse(response);
  }
}
