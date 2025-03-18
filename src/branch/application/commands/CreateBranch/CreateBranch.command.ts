import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { BranchDto } from '../../dtos/Branch.dto';
import { CreateBranchRequestDto } from '../../dtos/CreateBranchRequest.dto';


export class CreateBranchCommand extends Command<WsResponse< BranchDto | string>> {
  constructor(public body: CreateBranchRequestDto) {
    super();
  }
}
