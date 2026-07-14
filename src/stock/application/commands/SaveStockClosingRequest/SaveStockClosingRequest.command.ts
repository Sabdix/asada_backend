import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { SaveStockClosingRequestDto } from '../../dtos/SaveStockClosingRequest.dto';

export class SaveStockClosingRequestCommand extends Command<
  WsResponse<string>
> {
  constructor(public readonly data: SaveStockClosingRequestDto) {
    super();
  }
}
