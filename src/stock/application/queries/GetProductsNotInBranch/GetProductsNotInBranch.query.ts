import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockHistoryReportDto } from '../../dtos/StockHistoryReportDto';

export class GetProductsNotInBranchQuery extends Query<
  WsResponse<StockHistoryReportDto[]>
> {
  constructor(public readonly branchId: string) {
    super();
  }
}
