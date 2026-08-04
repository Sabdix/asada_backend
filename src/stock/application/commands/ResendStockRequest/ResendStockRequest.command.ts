import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class ResendStockRequestCommand extends Command<WsResponse<string>> {
  constructor(
    public readonly uuid: string,
    public readonly to: string,
    public readonly cc?: string,
    public readonly subject?: string,
  ) {
    super();
  }
}
