import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetStocksQuery } from './GetStocks.query';
import { StockDto } from '../../dtos/Stock.dto';
import { StockService } from '../../services/Stock.service';

@QueryHandler(GetStocksQuery)
export class GetStocksQueryHandler implements IQueryHandler<GetStocksQuery> {
  constructor(private stockService: StockService) { }

  async execute(query: GetStocksQuery) {
    const [stocks, total] = await this.stockService.getStocksPaginated(query.size, query.offset, query.category, query.product, query.branch, query.workArea);

    return WsResponse.buildOkListResponse(
      plainToInstance(StockDto, stocks, { excludeExtraneousValues: true }), total
    );
  }
}
