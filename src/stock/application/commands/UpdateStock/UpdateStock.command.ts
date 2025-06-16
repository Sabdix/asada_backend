import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { StockDto } from '../../dtos/Stock.dto';
import { UpdateStockRequestDto } from '../../dtos/UpdateStockRequest.dto';


export class UpdateStockCommand extends Command<WsResponse<StockDto | string>> {
    constructor(public body: UpdateStockRequestDto, public uuid: string
    ) {
        super();
    }
}
