import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteStockCommand } from './DeleteStock.command';
import { StockService } from '../../services/Stock.service';

@CommandHandler(DeleteStockCommand)
export class DeleteStockCommandHandler
    implements ICommandHandler<DeleteStockCommand> {
    constructor(private readonly stockService: StockService) { }

    async execute(command: DeleteStockCommand): Promise<WsResponse<null | string>> {
        const stock = await this.stockService.getStockByUuid(
            command.uuid,
        );

        if (!stock)
            return WsResponse.buildNotFoundResponse('STOCK NOT FOUND');

        await this.stockService.deleteStock(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
