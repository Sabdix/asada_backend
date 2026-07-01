import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockRequest } from 'src/stock/domain/entities/StockRequest.entity';

export class GetStockRequestsQuery extends Query<WsResponse<StockRequest[]>> {
  constructor(
    public readonly size: number,
    public readonly offset: number,
  ) {
    super();
  }
}
