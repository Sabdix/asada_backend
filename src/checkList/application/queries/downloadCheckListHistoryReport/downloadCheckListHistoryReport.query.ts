import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CheckListHistoryDto } from '../../dtos/CheckListHistory.dto';

export class DownloadCheckListHistoryReportQuery extends Query<WsResponse<Buffer | string>> {
  constructor(public readonly initialDate: Date, public readonly endDate: Date) {
    super();
  }
}
