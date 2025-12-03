import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class GetComplianceGroupedBranchAndChecklistQuery extends Query<
  WsResponse<any>
> {
  constructor(
    public dateInit: string,
    public dateEnd: string,
    public uuidBranch: string,
  ) {
    super();
  }
}
