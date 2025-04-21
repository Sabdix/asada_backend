import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { BranchReviewDto } from '../../dtos/BranchReview.dto';

export class GetBranchReviewsQuery extends Query<WsResponse<BranchReviewDto[] | string>> {
  constructor() {
    super();
  }
}
