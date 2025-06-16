import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { StockDto } from '../../dtos/Stock.dto';
import { StockService } from '../../services/Stock.service';
import { GetStockByUuidQuery } from './GetStockByUuid.query';

@QueryHandler(GetStockByUuidQuery)
export class GetStockByUuidQueryHandler implements IQueryHandler<GetStockByUuidQuery> {
    constructor(
        private stockService: StockService
    ) { }

    async execute(query: GetStockByUuidQuery) {
        const stock = await this.stockService.getStockByUuid(query.uuid);

        if (!stock) return WsResponse.buildNotFoundResponse('STOCK  NOT FOUND');

        return WsResponse.buildOkResponse(
            plainToInstance(StockDto, stock, { excludeExtraneousValues: true }),
        );
    }
}
