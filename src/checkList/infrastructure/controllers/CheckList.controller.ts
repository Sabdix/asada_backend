import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateCheckListCommand } from "src/checkList/application/commands/CreateCheckList/CreateCheckList.command";
import { CreateCheckListItemCommand } from "src/checkList/application/commands/CreateCheckListItem/CreateCheckListItem.command";
import { CreateCheckListItemCriteriaCommand } from "src/checkList/application/commands/CreateCheckListItemCriteria/CreateCheckListItemCriteria.command";
import { CreateCheckListItemCriteriaAnswerCommand } from "src/checkList/application/commands/CreateCheckListItemCriteriaAnswer/CreateCheckListItemCriteriaAnswer.command";
import { DeleteCheckListCommand } from "src/checkList/application/commands/DeleteCheckList/DeleteCheckList.command";
import { DeleteCheckListItemCommand } from "src/checkList/application/commands/DeleteCheckListItem/DeleteCheckListItem.command";
import { DeleteCheckListItemCriteriaCommand } from "src/checkList/application/commands/DeleteCheckListItemCriteria/DeleteCheckListItemCriteria.command";
import { DeleteCheckListItemCriteriaAnswerCommand } from "src/checkList/application/commands/DeleteCheckListItemCriteriaAnswer/DeleteCheckListItemCriteriaAnswer.command";
import { UpdateCheckListCommand } from "src/checkList/application/commands/UpdateCheckList/UpdateCheckList.command";
import { UpdateCheckListItemCommand } from "src/checkList/application/commands/UpdateCheckListItem/UpdateCheckListItem.command";
import { UpdateCheckListItemCriteriaCommand } from "src/checkList/application/commands/UpdateCheckListItemCriteria/UpdateCheckListItemCriteria.command";
import { UpdateCheckListItemCriteriaAnswerCommand } from "src/checkList/application/commands/UpdateCheckListItemCriteriaAnswer/UpdateCheckListItemCriteriaAnswer.command";
import { CreateCheckListRequestDto } from "src/checkList/application/dtos/CreateCheckList.dto";
import { CreateCheckListItemCriteriaAnswerRequestDto } from "src/checkList/application/dtos/CreateCheckListItemCriteriaAnswerRequestDto";
import { CreateCheckListItemCriteriaRequestDto } from "src/checkList/application/dtos/CreateCheckListItemCriteriaRequest.dto";
import { CreateCheckListItemRequestDto } from "src/checkList/application/dtos/CreateCheckListItemRequest.dto";
import { UpdateCheckListItemCriteriaAnswerRequestDto } from "src/checkList/application/dtos/UpdateCheckListItemCriteriaAnswerRequest.dto";
import { UpdateCheckListItemCriteriaRequestDto } from "src/checkList/application/dtos/UpdateCheckListItemCriteriaRequest.dto";
import { UpdateCheckListItemRequestDto } from "src/checkList/application/dtos/UpdateCheckListItemRequest.dto";
import { UpdateCheckListRequestDto } from "src/checkList/application/dtos/UpdateCheckListRequest.dto";
import { GetCheckListQuery } from "src/checkList/application/queries/getCheckList/getCheckList.query";
import { GetCheckListByUuidQuery } from "src/checkList/application/queries/getCheckListByUuid/getCheckListByUuid.query";
import { GetCheckListByUuidQueryHandler } from "src/checkList/application/queries/getCheckListByUuid/getCheckListByUuid.query.handler";
import { GetCheckListItemsByCheckListQuery } from "src/checkList/application/queries/getCheckListItemsByCheckList/getCheckListItemsByCheckList.query";
import { GetCriteriaAnswerByCriteriaQuery } from "src/checkList/application/queries/getCriteriaAnswerByCriteria/getCriteriaAnswerByCriteria.query";
import { GetItemCriteriaByItemQuery } from "src/checkList/application/queries/getItemCriteriaByItem/getItemCriteriaByItem.query";


@Controller('checklist')
export class CheckListController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }

  @Post('create')
  async createCheckList(@Body() createCheckListRequest: CreateCheckListRequestDto) {
    return this.commandBus.execute(new CreateCheckListCommand(createCheckListRequest));
  }

  @Get('/:uuid')
  async getCheckListByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListByUuidQuery(uuid));
  }

  @Get('')
  async getCheckList() {
    return this.queryBus.execute(new GetCheckListQuery());
  }

  @Delete('/:uuid')
  async deleteCheckList(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteCheckListCommand(uuid));
  }

  @Put('/:uuid')
  async UpdateCheckList(@Param('uuid') uuid: string, @Body() request: UpdateCheckListRequestDto) {
    return this.commandBus.execute(new UpdateCheckListCommand(request, uuid));
  }

  @Post('item/create')
  async createCheckListItem(@Body() createCheckListItemRequest: CreateCheckListItemRequestDto) {
    return this.commandBus.execute(new CreateCheckListItemCommand(createCheckListItemRequest));
  }

  @Post('criteria/create')
  async createCheckListItemCriteria(@Body() createCheckListItemCriteriaRequest: CreateCheckListItemCriteriaRequestDto) {
    return this.commandBus.execute(new CreateCheckListItemCriteriaCommand(createCheckListItemCriteriaRequest));
  }

  @Post('answer/create')
  async createCheckListItemCriteriaAnswer(@Body() createCheckListItemCriteriaAnswerRequest: CreateCheckListItemCriteriaAnswerRequestDto) {
    return this.commandBus.execute(new CreateCheckListItemCriteriaAnswerCommand(createCheckListItemCriteriaAnswerRequest));
  }

  @Delete('item/:uuid')
  async deleteCheckListItem(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteCheckListItemCommand(uuid));
  }

  @Delete('criteria/:uuid')
  async deleteCheckListItemCriteria(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteCheckListItemCriteriaCommand(uuid));
  }

  @Delete('answer/:uuid')
  async deleteCheckListItemCriteriaAnswer(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteCheckListItemCriteriaAnswerCommand(uuid));
  }

  @Put('item/:uuid')
  async UpdateCheckListItem(@Param('uuid') uuid: string, @Body() request: UpdateCheckListItemRequestDto) {
    return this.commandBus.execute(new UpdateCheckListItemCommand(request, uuid));
  }

  @Put('criteria/:uuid')
  async UpdateCheckListItemCriteria(@Param('uuid') uuid: string, @Body() request: UpdateCheckListItemCriteriaRequestDto) {
    return this.commandBus.execute(new UpdateCheckListItemCriteriaCommand(request, uuid));
  }

  @Put('answer/:uuid')
  async UpdateCheckListItemCriteriaAnswer(@Param('uuid') uuid: string, @Body() request: UpdateCheckListItemCriteriaAnswerRequestDto) {
    return this.commandBus.execute(new UpdateCheckListItemCriteriaAnswerCommand(request, uuid));
  }

  @Get('item/:uuid')
  async getCheckListItemByCheckList(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListItemsByCheckListQuery(uuid));
  }

  @Get('criteria/:uuid')
  async getItemCriteriaByItem(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetItemCriteriaByItemQuery(uuid));
  }

  @Get('answer/:uuid')
  async getCriteriaAnswerByCriteria(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCriteriaAnswerByCriteriaQuery(uuid));
  }
}
