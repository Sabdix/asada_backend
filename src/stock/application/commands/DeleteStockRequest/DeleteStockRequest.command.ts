import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class DeleteStockRequestCommand extends Command<WsResponse<string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
