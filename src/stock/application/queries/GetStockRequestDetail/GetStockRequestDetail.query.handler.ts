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

    // Round decimals to 2 places
    const rounded = details.map((detail) => ({
      ...detail,
      a_solicitar:
        detail.a_solicitar != null
          ? Math.round(Number(detail.a_solicitar) * 100) / 100
          : null,
      a_solicitar_festivo:
        detail.a_solicitar_festivo != null
          ? Math.round(Number(detail.a_solicitar_festivo) * 100) / 100
          : null,
      entradas:
        detail.entradas != null
          ? Math.round(Number(detail.entradas) * 100) / 100
          : null,
    }));

    return WsResponse.buildOkResponse(rounded);
  }
}
