import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockHistoryReportDto } from '../../dtos/StockHistoryReportDto';

export type StockClosingReportFormat = 'JSON' | 'EXCEL';

export class DownloadStockClosingReportQuery extends Query<
  WsResponse<Buffer | StockHistoryReportDto[] | string>
> {
  constructor(
    public readonly date: Date,
    public readonly branchId: string,
    public readonly format: StockClosingReportFormat,
  ) {
    super();
  }
}
