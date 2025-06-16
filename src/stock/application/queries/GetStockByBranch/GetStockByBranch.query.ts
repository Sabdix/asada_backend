import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockDto } from '../../dtos/Stock.dto';

export class GetStockByBranchQuery extends Query<WsResponse<StockDto[] | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
