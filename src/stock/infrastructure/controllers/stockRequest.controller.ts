import { Controller, Get, Param, Query } from '@nestjs/common';
import { QueryBus } from '@nestjs/cqrs';
import { GetStockRequestsQuery } from 'src/stock/application/queries/GetStockRequests/GetStockRequests.query';
import { GetStockRequestDetailQuery } from 'src/stock/application/queries/GetStockRequestDetail/GetStockRequestDetail.query';

@Controller('stock-request')
export class StockRequestController {
  constructor(private readonly queryBus: QueryBus) {}

  @Get()
  async getStockRequests(
    @Query('size') size: number,
    @Query('offset') offset: number,
  ) {
    return this.queryBus.execute(new GetStockRequestsQuery(size, offset));
  }

  @Get(':uuid/detail')
  async getStockRequestDetail(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetStockRequestDetailQuery(uuid));
  }
}
