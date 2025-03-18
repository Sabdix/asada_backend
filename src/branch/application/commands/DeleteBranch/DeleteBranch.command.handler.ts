import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { DeleteBranchCommand } from './DeleteBranch.command';
import { BranchService } from '../../services/Branch.service';

@CommandHandler(DeleteBranchCommand)
export class DeleteBranchCommandHandler
    implements ICommandHandler<DeleteBranchCommand> {
    constructor(private readonly branchService: BranchService) { }

    async execute(
        command: DeleteBranchCommand,
    ): Promise<WsResponse<null | string>> {
        const branch = await this.branchService.getBranchByUuid(
            command.uuid,
        );

        if (!branch)
            return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        await this.branchService.deleteBranch(command.uuid);

        return WsResponse.buildOkResponse(null);
    }
}
