import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Logger } from '@nestjs/common';
import { SaveStockClosingRequestCommand } from './SaveStockClosingRequest.command';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockRequestService } from '../../services/StockRequest.service';

@CommandHandler(SaveStockClosingRequestCommand)
export class SaveStockClosingRequestCommandHandler
  implements ICommandHandler<SaveStockClosingRequestCommand>
{
  private readonly logger = new Logger(
    SaveStockClosingRequestCommandHandler.name,
  );

  constructor(private readonly stockRequestService: StockRequestService) {}

  async execute(
    command: SaveStockClosingRequestCommand,
  ): Promise<WsResponse<string>> {
    const { branchId, data } = command.data;

    try {
      const savedRequest = await this.stockRequestService.createRequest(
        '',
        '',
        '',
        'PENDING',
        branchId || null,
        data,
        'PENDING',
      );

      this.logger.log(
        `Stock closing request saved with UUID: ${savedRequest.uuid}`,
      );
      return WsResponse.buildOkResponse(savedRequest.uuid);
    } catch (error) {
      this.logger.error('Error saving stock closing request', error);
      return WsResponse.buildErrorResponse(
        1,
        'Error saving stock closing request',
        error?.message ?? error,
      );
    }
  }
}
