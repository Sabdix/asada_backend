import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetBranchesQuery } from './GetBranches.query';
import { BranchService } from '../../services/Branch.service';
import { BranchDto } from '../../dtos/Branch.dto';

@QueryHandler(GetBranchesQuery)
export class GetBranchesQueryHandler implements IQueryHandler<GetBranchesQuery> {
  constructor(private  branchService: BranchService) {}

  async execute(): Promise<WsResponse<BranchDto[]>> {
    const branches = await this.branchService.getBranches();

    return WsResponse.buildOkResponse(
      plainToInstance(BranchDto, branches, { excludeExtraneousValues: true }),
    );
  }
}
