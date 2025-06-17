import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ValidateStockRequestDto } from '../../dtos/ValidateStockRequest.dto';


export class ValidateStockCommand extends Command<WsResponse< null | string>> {
  constructor(public body: ValidateStockRequestDto) {
    super();
  }
}
