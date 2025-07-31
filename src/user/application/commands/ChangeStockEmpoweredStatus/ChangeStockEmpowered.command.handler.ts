import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { UserService } from '../../services/user.service';
import { ChangeStockEmpoweredStatusCommand } from './ChangeStockEmpowered.command';

@CommandHandler(ChangeStockEmpoweredStatusCommand)
export class ChangeStockEmpoweredStatusCommandHandler implements ICommandHandler<ChangeStockEmpoweredStatusCommand> {
    constructor(private readonly userService: UserService) { }

    async execute(command: ChangeStockEmpoweredStatusCommand,  ): Promise<WsResponse<null | string>> {
        
        const user = await this.userService.getUserByUuid(
            command.uuid,
        );

        if (!user)
            return WsResponse.buildNotFoundResponse('USER NOT FOUND');

        user.stock_empowered = !user.stock_empowered;

        await this.userService.UpdateUser(user);

        return WsResponse.buildOkResponse(null);
    }
}
