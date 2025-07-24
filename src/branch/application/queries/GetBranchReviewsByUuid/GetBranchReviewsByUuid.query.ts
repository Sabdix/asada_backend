import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { BranchReviewDto } from '../../dtos/BranchReview.dto';

export class GetBranchReviewsByUuidQuery extends Query<WsResponse<BranchReviewDto[] | string>> {
  constructor(
    public readonly uuid: string, 
    public readonly size: number,
    public readonly offset: number
  ) {
    super();
  }
}
