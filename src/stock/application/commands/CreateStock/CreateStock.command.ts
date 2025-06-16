import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateStockRequestDto } from '../../dtos/CreateStock.dto';
import { StockDto } from '../../dtos/Stock.dto';


export class CreateStockCommand extends Command<WsResponse< StockDto | string>> {
  constructor(public body: CreateStockRequestDto) {
    super();
  }
}
