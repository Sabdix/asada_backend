import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ValidateStockCommand } from './ValidateStock.command';
import { StockService } from '../../services/Stock.service';
import { UserService } from 'src/user/application/services/user.service';
import { StockHistoryService } from '../../services/StockHistory.service';
import { toZonedTime } from 'date-fns-tz';
;

@CommandHandler(ValidateStockCommand)
export class ValidateStockCommandHandler implements ICommandHandler<ValidateStockCommand> {
    constructor(
        private stockService: StockService,
        private userService: UserService,
        private stockHistory: StockHistoryService
    ) { }

    async execute(command: ValidateStockCommand): Promise<WsResponse<null | string>> {

        const user = await this.userService.getUserByUuid(command.body.uuid_user);
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        const today = new Date();
        const mexicoCityTime = toZonedTime(today, 'America/Mexico_City');
        const dateOnly = new Date(mexicoCityTime.getFullYear(), mexicoCityTime.getMonth(), mexicoCityTime.getDate());

        for (const item of command.body.stocks) {
            const stock = await this.stockService.getStockByUuid(item.uuid_stock);
            if (!stock)
                return WsResponse.buildNotFoundResponse('STOCK NOT FOUND');

            await this.stockHistory.creteStock(stock.uuid, user.uuid, item.quantity, stock.quantity, command.body.type, dateOnly, command.body.uuid_check_list)

            stock.quantity = item.quantity
            await this.stockService.updateStock(stock)
        }

        return WsResponse.buildOkResponse(null);

    }
}
