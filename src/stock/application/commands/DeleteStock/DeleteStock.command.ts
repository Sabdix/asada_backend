import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class DeleteStockCommand extends Command<WsResponse< null | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
