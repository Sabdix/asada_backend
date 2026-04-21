import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { BranchService } from 'src/branch/application/services/Branch.service';
import { StockService } from '../../services/Stock.service';
import { CreateStockEntranceCommand } from './CreateStockEntrance.command';
import { UserService } from 'src/user/application/services/user.service';
import { StockEntrancesService } from '../../services/StockEntrances.service';
;

@CommandHandler(CreateStockEntranceCommand)
export class CreateStockEntranceCommandHandler implements ICommandHandler<CreateStockEntranceCommand> {
    constructor(
        private branchService: BranchService,
        private userService: UserService,
        private stockService: StockService,
        private stockEntranceService: StockEntrancesService

    ) { }

    async execute(command: CreateStockEntranceCommand): Promise<WsResponse<string>> {

        const user = await this.userService.getUserByUuid(command.body.uuid_user);
        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        const branch = await this.branchService.getBranchByUuid(command.body.uuid_branch);
        if (!branch)
            return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        for (const entrance of command.body.stocks) {

            const stock = await this.stockService.getStockByUuid(entrance.uuid_stock)
            if (!stock)
                return WsResponse.buildNotFoundResponse('STOCK NOT FOUND');


            await this.stockEntranceService.creteStockEntrance(command.body.uuid_branch, command.body.uuid_user, stock?.uuid, entrance.quantity)
        }

        return WsResponse.buildOkResponse("STOCK ENTRANCE CREATED")
    }
}
