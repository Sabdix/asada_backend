import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockRequestDetail } from 'src/stock/domain/entities/StockRequestDetail.entity';

export class GetStockRequestDetailQuery extends Query<
  WsResponse<StockRequestDetail[] | string>
> {
  constructor(public readonly uuid: string) {
    super();
  }
}
