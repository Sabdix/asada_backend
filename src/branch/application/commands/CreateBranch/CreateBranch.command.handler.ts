import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';;
import { CreateBranchCommand } from './CreateBranch.command';
import { BranchService } from '../../services/Branch.service';
import { BranchDto } from '../../dtos/Branch.dto';

@CommandHandler(CreateBranchCommand)
export class CreateBranchCommandHandler implements ICommandHandler<CreateBranchCommand> {
  constructor(
    private branchService: BranchService,
  ) {}

  async execute(command: CreateBranchCommand): Promise<WsResponse<BranchDto | string>> {

    if (await this.branchService.getBranchByName(command.body.name))
        return WsResponse.buildConflictResponse('YA EXISTE UNA SUCURSAL CON ESE NOMBRE','BRANCH ALREADY EXISTS');

    const branch = await this.branchService.creteBranch(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(BranchDto, branch, { excludeExtraneousValues: true }),
    );
  }
}
