import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { BranchDto } from '../../dtos/Branch.dto';

export class GetBranchByUuidQuery extends Query<WsResponse<BranchDto | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
