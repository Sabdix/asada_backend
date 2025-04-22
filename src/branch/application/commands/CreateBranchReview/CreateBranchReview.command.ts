import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { CreateBranchReviewRequestDto } from '../../dtos/CreateBranchReviewRequest.dto';
import { BranchReviewDto } from '../../dtos/BranchReview.dto';


export class CreateBranchReviewCommand extends Command<WsResponse<BranchReviewDto | string>> {
    constructor(public readonly uuid: string, public readonly body: CreateBranchReviewRequestDto) {
        super();
    }
}
