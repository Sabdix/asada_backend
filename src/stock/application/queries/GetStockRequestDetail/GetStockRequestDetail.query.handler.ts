import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStockRequestDetailQuery } from './GetStockRequestDetail.query';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockRequestService } from '../../services/StockRequest.service';
import { StockRequestDetail } from 'src/stock/domain/entities/StockRequestDetail.entity';

@QueryHandler(GetStockRequestDetailQuery)
export class GetStockRequestDetailQueryHandler
  implements IQueryHandler<GetStockRequestDetailQuery>
{
  constructor(private readonly stockRequestService: StockRequestService) {}

  async execute(
    query: GetStockRequestDetailQuery,
  ): Promise<WsResponse<StockRequestDetail[] | string>> {
    const details = await this.stockRequestService.getDetailByRequestUuid(
      query.uuid,
    );
    if (!details || details.length === 0) {
      return WsResponse.buildNotFoundResponse('STOCK_REQUEST_DETAIL NOT FOUND');
    }
    return WsResponse.buildOkResponse(details);
  }
}
