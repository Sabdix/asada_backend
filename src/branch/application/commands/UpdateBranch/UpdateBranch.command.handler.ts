import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { UpdateBranchCommand } from './UpdateBranch.command';
import { BranchService } from '../../services/Branch.service';
import { BranchDto } from '../../dtos/Branch.dto';

@CommandHandler(UpdateBranchCommand)
export class UpdateBranchCommandHandler implements ICommandHandler<UpdateBranchCommand> {
    constructor(
        private branchService: BranchService,
    ) { }

    async execute(command: UpdateBranchCommand): Promise<WsResponse<BranchDto | string>> {

        const branch = await this.branchService.getBranchByUuid(command.uuid);
        if (!branch)
            return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

        branch.name = command.body.name ?? branch.name;
        branch.lat = command.body.lat ?? branch.lat;
        branch.lng = command.body.lng ?? branch.lng;
        branch.street = command.body.street ?? branch.street;
        branch.neigborhood = command.body.neigborhood ?? branch.neigborhood;
        branch.zip_code = command.body.zip_code ?? branch.zip_code;
        branch.internal_number = command.body.internal_number ?? branch.internal_number;
        branch.external_number = command.body.external_number ?? branch.external_number;
        branch.state = command.body.state ?? branch.state;
        branch.locality = command.body.locality ?? branch.locality;
        branch.place_id = command.body.place_id ?? branch.place_id;

        await this.branchService.UpdateBranch(branch);

        return WsResponse.buildOkResponse(
            plainToInstance(BranchDto, branch, { excludeExtraneousValues: true }),
        );
    }
}
