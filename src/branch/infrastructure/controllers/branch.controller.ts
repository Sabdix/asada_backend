import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateBranchCommand } from "src/branch/application/commands/CreateBranch/CreateBranch.command";
import { DeleteBranchCommand } from "src/branch/application/commands/DeleteBranch/DeleteBranch.command";
import { UpdateBranchCommand } from "src/branch/application/commands/UpdateBranch/UpdateBranch.command";
import { CreateBranchRequestDto } from "src/branch/application/dtos/CreateBranchRequest.dto";
import { UpdateBranchRequestDto } from "src/branch/application/dtos/UpdateBranchRequest.dto";
import { GetBranchByUuidQuery } from "src/branch/application/queries/GetBranchByUuid/GetBranchByUuid.query";
import { GetBranchesQuery } from "src/branch/application/queries/GetBranches/GetBranches.query";

@Controller('branch')
export class branchController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }

  @Post('create')
  async createBranch(@Body() createBranchRequestDto: CreateBranchRequestDto) {
    return this.commandBus.execute(new CreateBranchCommand(createBranchRequestDto));
  }

  @Get('/:uuid')
  async getBranchByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetBranchByUuidQuery(uuid));
  }

  @Get('')
  async getBranches() {
    return this.queryBus.execute(new GetBranchesQuery());
  }

  @Delete('/:uuid')
  async deleteBranch(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteBranchCommand(uuid));
  }

  @Put('/:uuid')
  async UpdateBranch(@Param('uuid') uuid: string, @Body() request: UpdateBranchRequestDto ) {
    return this.commandBus.execute(new UpdateBranchCommand(request,uuid));
  }
}
