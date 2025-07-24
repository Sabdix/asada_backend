import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetBranchReviewsQuery } from './GetBranchReviews.query';
import { BranchReviewDto } from '../../dtos/BranchReview.dto';
import { BranchReviewService } from '../../services/BranchReview.service';

@QueryHandler(GetBranchReviewsQuery)
export class GetBranchReviewsQueryHandler implements IQueryHandler<GetBranchReviewsQuery> {
    constructor(private branchReviewService: BranchReviewService) { }

    async execute(query: GetBranchReviewsQuery): Promise<WsResponse<BranchReviewDto[]>> {
        const [branchReviews, total] = await this.branchReviewService.getBranchReviewsPaginated(query.size, query.offset);

        return WsResponse.buildOkListResponse(
            plainToInstance(BranchReviewDto, branchReviews, { excludeExtraneousValues: true }), total
        );
    }
}
