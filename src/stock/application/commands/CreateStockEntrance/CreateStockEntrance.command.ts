import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';    
import { StockDto } from '../../dtos/Stock.dto';
import { CreateStockEntranceRequestDto } from '../../dtos/CreateStockEntranceRequest.dto';


export class CreateStockEntranceCommand extends Command<WsResponse< string>> {
  constructor(public body: CreateStockEntranceRequestDto) {
    super();
  }
}
