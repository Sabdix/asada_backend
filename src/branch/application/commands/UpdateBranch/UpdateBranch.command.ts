import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { BranchDto } from '../../dtos/Branch.dto';
import { UpdateBranchRequestDto } from '../../dtos/UpdateBranchRequest.dto';


export class UpdateBranchCommand extends Command<WsResponse<BranchDto | string>> {
  constructor(public readonly body: UpdateBranchRequestDto, public readonly uuid: string
  ) {
    super();
  }
}
