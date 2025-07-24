import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { BranchService } from '../../services/Branch.service';
import { GetBranchReviewsByUuidQuery } from './GetBranchReviewsByUuid.query';
import { BranchReviewDto } from '../../dtos/BranchReview.dto';
import { BranchReviewService } from '../../services/BranchReview.service';

@QueryHandler(GetBranchReviewsByUuidQuery)
export class GetBranchReviewsByUuidQueryHandler implements IQueryHandler<GetBranchReviewsByUuidQuery> {
  constructor(
    private  branchService: BranchService,
    private branchReviewService: BranchReviewService
) {}

  async execute(query: GetBranchReviewsByUuidQuery) {
    const branch = await this.branchService.getBranchByUuid(query.uuid);

    if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

    const [branchReviews, total] = await this.branchReviewService.getBranchReviewsByUuidPaginated(branch.uuid, query.size, query.offset)

    return WsResponse.buildOkListResponse(
      plainToInstance(BranchReviewDto, branchReviews, { excludeExtraneousValues: true }), total
    );
  }
}
