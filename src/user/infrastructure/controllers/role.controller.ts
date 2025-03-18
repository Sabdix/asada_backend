import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateRoleCommand } from "src/user/application/commands/CreateRole/CreateRole.command";
import { DeleteRoleCommand } from "src/user/application/commands/DeleteRole/DeleteRole.command";
import { UpdateRoleCommand } from "src/user/application/commands/UpdateRole/UpdateRole.command";
import { CreateRoleRequestDto } from "src/user/application/dtos/CreateRoleRequest.dto";
import { UpdateRoleRequestDto } from "src/user/application/dtos/UpdateRole.Request.dto";
import { GetRoleByUuidQuery } from "src/user/application/queries/GetRoleByUuid/GetRoleByUuid.query";
import { GetRolesQuery } from "src/user/application/queries/GetRoles/GetRoles.query";

@Controller('role')
export class RoleController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }

  @Post('create')
  async createRole(@Body() crateRolRequestDto: CreateRoleRequestDto) {
    return this.commandBus.execute(new CreateRoleCommand(crateRolRequestDto));
  }

  @Get('/:uuid')
  async getRoleByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetRoleByUuidQuery(uuid));
  }

  @Get('')
  async getRoles() {
    return this.queryBus.execute(new GetRolesQuery());
  }

  @Delete('/:uuid')
  async deleteRole(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteRoleCommand(uuid));
  }

  @Put('/:uuid')
  async UpdateRole(@Param('uuid') uuid: string, @Body() request: UpdateRoleRequestDto ) {
    return this.commandBus.execute(new UpdateRoleCommand(request,uuid));
  }

}
