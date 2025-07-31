import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class DownloadStockReportQuery extends Query<WsResponse<Buffer | string>> {
  constructor(public readonly initialDate: Date, public readonly endDate: Date, public readonly branchId) {
    super();
  }
}
