import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { GetStockRequestsQuery } from 'src/stock/application/queries/GetStockRequests/GetStockRequests.query';
import { GetStockRequestDetailQuery } from 'src/stock/application/queries/GetStockRequestDetail/GetStockRequestDetail.query';
import { SaveStockClosingRequestCommand } from 'src/stock/application/commands/SaveStockClosingRequest/SaveStockClosingRequest.command';
import { ResendStockRequestCommand } from 'src/stock/application/commands/ResendStockRequest/ResendStockRequest.command';
import { SaveStockClosingRequestDto } from 'src/stock/application/dtos/SaveStockClosingRequest.dto';
import { ResendStockRequestDto } from 'src/stock/application/dtos/ResendStockRequest.dto';

@Controller('stock-request')
export class StockRequestController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get()
  async getStockRequests(
    @Query('size') size: number,
    @Query('offset') offset: number,
    @Query('branchId') branchId: string,
  ) {
    return this.queryBus.execute(
      new GetStockRequestsQuery(size, offset, branchId),
    );
  }

  @Get(':uuid/detail')
  async getStockRequestDetail(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetStockRequestDetailQuery(uuid));
  }

  @Post('save')
  async saveStockClosingRequest(@Body() body: SaveStockClosingRequestDto) {
    return this.commandBus.execute(new SaveStockClosingRequestCommand(body));
  }

  @Post(':uuid/resend')
  async resendStockRequest(
    @Param('uuid') uuid: string,
    @Body() body: ResendStockRequestDto,
  ) {
    return this.commandBus.execute(
      new ResendStockRequestCommand(uuid, body.to, body.cc, body.subject),
    );
  }
}
