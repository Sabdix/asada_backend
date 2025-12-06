import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';

export class GetComplianceQuerySummary extends Query<WsResponse<any>> {
  constructor(
    public readonly dateInit: string,
    public readonly dateEnd: string,
    public readonly uuidBranch: string,
    public readonly uuidBChecklist: string
  ) {
    super();
  }
}
