import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { SaveStockClosingRequestDto } from '../../dtos/SaveStockClosingRequest.dto';

export class UpdateStockRequestCommand extends Command<WsResponse<string>> {
  constructor(
    public readonly uuid: string,
    public readonly data: SaveStockClosingRequestDto,
  ) {
    super();
  }
}
