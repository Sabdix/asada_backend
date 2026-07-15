import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { UpdateStockRequestCommand } from './UpdateStockRequest.command';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockRequestService } from '../../services/StockRequest.service';

@CommandHandler(UpdateStockRequestCommand)
export class UpdateStockRequestCommandHandler
  implements ICommandHandler<UpdateStockRequestCommand>
{
  constructor(private readonly stockRequestService: StockRequestService) {}

  async execute(command: UpdateStockRequestCommand): Promise<WsResponse<string>> {
    const { uuid, data } = command;

    const updated = await this.stockRequestService.updateRequest(
      uuid,
      data.data,
      data.branchId,
    );

    if (!updated) {
      return WsResponse.buildNotFoundResponse('STOCK_REQUEST NOT FOUND');
    }

    return WsResponse.buildOkResponse(updated.uuid);
  }
}
