import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { BranchService } from '../../services/Branch.service';
import { CreateBranchReviewCommand } from './CreateBranchReview.command';
import { BranchReviewDto } from '../../dtos/BranchReview.dto';
import { BranchReviewService } from '../../services/BranchReview.service';

@CommandHandler(CreateBranchReviewCommand)
export class CreateBranchReviewCommandHandler implements ICommandHandler<CreateBranchReviewCommand> {
    constructor(
        private branchService: BranchService,
        private branchReviewService: BranchReviewService
    ) { }

    async execute(command: CreateBranchReviewCommand): Promise<WsResponse<BranchReviewDto | string>> {

        const branch = await this.branchService.getBranchByUuid(command.uuid)

        if (!branch)
            return WsResponse.buildNotFoundResponse('BRANCH NOT EXISTS');

        const branchReview = await this.branchReviewService.creteBranchReview(command.body, branch)

        return WsResponse.buildOkResponse(
            plainToInstance(BranchReviewDto, branchReview, { excludeExtraneousValues: true }),
        );
    }
}
