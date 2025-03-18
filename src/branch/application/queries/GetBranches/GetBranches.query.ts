import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { BranchDto } from '../../dtos/Branch.dto';

export class GetBranchesQuery extends Query<WsResponse<BranchDto[] | string>> {
  constructor() {
    super();
  }
}
