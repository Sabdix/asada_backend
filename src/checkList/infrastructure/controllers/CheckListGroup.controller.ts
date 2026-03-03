import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateCheckListGroupCommand } from 'src/checkList/application/commands/CreateCheckListGroup/CreateCheckListGroup.command';
import { UpdateCheckListGroupCommand } from 'src/checkList/application/commands/UpdateCheckListGroup/UpdateCheckListGroup.command';
import { DeleteCheckListGroupCommand } from 'src/checkList/application/commands/DeleteCheckListGroup/DeleteCheckListGroup.command';
import { GetCheckListGroupsQuery } from 'src/checkList/application/queries/GetCheckListGroups/GetCheckListGroups.query';
import { GetCheckListGroupByUuidQuery } from 'src/checkList/application/queries/GetCheckListGroupByUuid/GetCheckListGroupByUuid.query';
import { GetCheckListGroupQrByUuidQuery } from 'src/checkList/application/queries/GetCheckListGroupQrByUuid/GetCheckListGroupQrByUuid.query';
import { CreateCheckListGroupRequestDto } from 'src/checkList/application/dtos/CreateCheckListGroup.dto';
import { UpdateCheckListGroupRequestDto } from 'src/checkList/application/dtos/UpdateCheckListGroup.dto';

@Controller('checklist-group')
export class CheckListGroupController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('create')
  async createCheckListGroup(
    @Body() createCheckListGroupRequest: CreateCheckListGroupRequestDto,
  ) {
    return this.commandBus.execute(
      new CreateCheckListGroupCommand(createCheckListGroupRequest),
    );
  }

  @Get('/:uuid')
  async getCheckListGroupByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListGroupByUuidQuery(uuid));
  }

  @Get()
  async getCheckListGroups(@Query('name') name?: string) {
    return this.queryBus.execute(new GetCheckListGroupsQuery(name));
  }

  @Put('/:uuid')
  async updateCheckListGroup(
    @Param('uuid') uuid: string,
    @Body() request: UpdateCheckListGroupRequestDto,
  ) {
    return this.commandBus.execute(
      new UpdateCheckListGroupCommand(request, uuid),
    );
  }

  @Delete('/:uuid')
  async deleteCheckListGroup(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteCheckListGroupCommand(uuid));
  }

  @Get('generate-qr/:uuid')
  async getCheckListGroupQrByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListGroupQrByUuidQuery(uuid));
  }
}
