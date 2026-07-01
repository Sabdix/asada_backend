import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetStockRequestsQuery } from './GetStockRequests.query';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockRequestService } from '../../services/StockRequest.service';
import { StockRequest } from 'src/stock/domain/entities/StockRequest.entity';

@QueryHandler(GetStockRequestsQuery)
export class GetStockRequestsQueryHandler
  implements IQueryHandler<GetStockRequestsQuery>
{
  constructor(private readonly stockRequestService: StockRequestService) {}

  async execute(
    query: GetStockRequestsQuery,
  ): Promise<WsResponse<StockRequest[]>> {
    const [requests, total] = await this.stockRequestService.getAllPaginated(
      query.size,
      query.offset,
      query.branchId,
    );
    return WsResponse.buildOkListResponse(requests, total);
  }
}
