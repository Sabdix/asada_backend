import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetBranchByUuidQuery } from './GetBranchByUuid.query';
import { BranchService } from '../../services/Branch.service';
import { BranchDto } from '../../dtos/Branch.dto';

@QueryHandler(GetBranchByUuidQuery)
export class GetBranchByUuidQueryHandler implements IQueryHandler<GetBranchByUuidQuery> {
  constructor(private  branchService: BranchService) {}

  async execute(query: GetBranchByUuidQuery) {
    const branch = await this.branchService.getBranchByUuid(query.uuid);

    if (!branch) return WsResponse.buildNotFoundResponse('BRANCH NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(BranchDto, branch, { excludeExtraneousValues: true }),
    );
  }
}
