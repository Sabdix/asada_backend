import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteStockRequestCommand } from './DeleteStockRequest.command';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockRequestService } from '../../services/StockRequest.service';

@CommandHandler(DeleteStockRequestCommand)
export class DeleteStockRequestCommandHandler
  implements ICommandHandler<DeleteStockRequestCommand>
{
  constructor(private readonly stockRequestService: StockRequestService) {}

  async execute(command: DeleteStockRequestCommand): Promise<WsResponse<string>> {
    const deleted = await this.stockRequestService.deleteRequest(command.uuid);

    if (!deleted) {
      return WsResponse.buildNotFoundResponse('STOCK_REQUEST NOT FOUND');
    }

    return WsResponse.buildOkResponse('Stock request deleted successfully');
  }
}
