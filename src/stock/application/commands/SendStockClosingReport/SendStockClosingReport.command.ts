import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { SendStockClosingReportRequestDto } from '../../dtos/SendStockClosingReportRequest.dto';

export class SendStockClosingReportCommand extends Command<WsResponse<string>> {
  constructor(public readonly data: SendStockClosingReportRequestDto) {
    super();
  }
}
