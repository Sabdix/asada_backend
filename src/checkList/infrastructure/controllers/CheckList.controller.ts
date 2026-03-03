import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { Response } from 'express';
import { AnswerCheckListCommand } from 'src/checkList/application/commands/AnswerCheckList/AnswerCheckList.command';
import { CreateCheckListCommand } from 'src/checkList/application/commands/CreateCheckList/CreateCheckList.command';
import { CreateCheckListItemCommand } from 'src/checkList/application/commands/CreateCheckListItem/CreateCheckListItem.command';
import { CreateCheckListItemCriteriaCommand } from 'src/checkList/application/commands/CreateCheckListItemCriteria/CreateCheckListItemCriteria.command';
import { CreateCheckListItemCriteriaAnswerCommand } from 'src/checkList/application/commands/CreateCheckListItemCriteriaAnswer/CreateCheckListItemCriteriaAnswer.command';
import { DeleteCheckListCommand } from 'src/checkList/application/commands/DeleteCheckList/DeleteCheckList.command';
import { DeleteCheckListItemCommand } from 'src/checkList/application/commands/DeleteCheckListItem/DeleteCheckListItem.command';
import { DeleteCheckListItemCriteriaCommand } from 'src/checkList/application/commands/DeleteCheckListItemCriteria/DeleteCheckListItemCriteria.command';
import { DeleteCheckListItemCriteriaAnswerCommand } from 'src/checkList/application/commands/DeleteCheckListItemCriteriaAnswer/DeleteCheckListItemCriteriaAnswer.command';
import { DuplicateCheckListCommand } from 'src/checkList/application/commands/DuplicateCheckList/DuplicateCheckList.command';
import { DuplicateItemCommand } from 'src/checkList/application/commands/DuplicateItem/DuplicateItem.command';
import { ManagerReviewCheckListHistoryCommand } from 'src/checkList/application/commands/ManagerReviewCheckListHistory/ManagerReviewCheckList.command';
import { ReassignHistoryCommand } from 'src/checkList/application/commands/ResassingHistory/ReassignHistory.command';
import { ReviewCheckListHistoryCommand } from 'src/checkList/application/commands/ReviewCheckListHistory/ReviewCheckListHistory.command';
import { UpdateCheckListCommand } from 'src/checkList/application/commands/UpdateCheckList/UpdateCheckList.command';
import { UpdateCheckListItemCommand } from 'src/checkList/application/commands/UpdateCheckListItem/UpdateCheckListItem.command';
import { UpdateCheckListItemCriteriaCommand } from 'src/checkList/application/commands/UpdateCheckListItemCriteria/UpdateCheckListItemCriteria.command';
import { UpdateCheckListItemCriteriaAnswerCommand } from 'src/checkList/application/commands/UpdateCheckListItemCriteriaAnswer/UpdateCheckListItemCriteriaAnswer.command';
import { UpdateHistoryStatusCommand } from 'src/checkList/application/commands/UpdateHistoryStatus/UpdateHistoryStatus.command';
import { CreateCheckListRequestDto } from 'src/checkList/application/dtos/CreateCheckList.dto';
import { CreateCheckListItemCriteriaAnswerRequestDto } from 'src/checkList/application/dtos/CreateCheckListItemCriteriaAnswerRequestDto';
import { CreateCheckListItemCriteriaRequestDto } from 'src/checkList/application/dtos/CreateCheckListItemCriteriaRequest.dto';
import { CreateCheckListItemRequestDto } from 'src/checkList/application/dtos/CreateCheckListItemRequest.dto';
import { CreateCheckListUserAnswerRequest } from 'src/checkList/application/dtos/CreateCheckListUserAnswerRequest.dto';
import { DuplicateCheckListRequestDto } from 'src/checkList/application/dtos/DuplicateCheckListRequest.dto';
import { DuplicateItemRequestDto } from 'src/checkList/application/dtos/DuplicateItemRequest.dto';
import { ManagerReviewCheckListHistoryDto } from 'src/checkList/application/dtos/ManagerReviewCheckListHistoryDto';
import { ReassignHistoryRequestDto } from 'src/checkList/application/dtos/ReassignHistoryRequest.dto';
import { ReviewCheckListHistoryDto } from 'src/checkList/application/dtos/ReviewCheckListHistory.dto';
import { UpdateCheckListItemCriteriaAnswerRequestDto } from 'src/checkList/application/dtos/UpdateCheckListItemCriteriaAnswerRequest.dto';
import { UpdateCheckListItemCriteriaRequestDto } from 'src/checkList/application/dtos/UpdateCheckListItemCriteriaRequest.dto';
import { UpdateCheckListItemRequestDto } from 'src/checkList/application/dtos/UpdateCheckListItemRequest.dto';
import { UpdateCheckListRequestDto } from 'src/checkList/application/dtos/UpdateCheckListRequest.dto';
import { UpdateHistoryStatusRequestDto } from 'src/checkList/application/dtos/UpdateHistoryStatusRequest.dto';
import { DownloadCheckListHistoryReportQuery } from 'src/checkList/application/queries/downloadCheckListHistoryReport/downloadCheckListHistoryReport.query';
import { GetAssignedCheckListQuery } from 'src/checkList/application/queries/getAssignedCheckList/getAssignedCheckList.query';
import { GetAssignedCheckListByBranchQuery } from 'src/checkList/application/queries/getAssignedCheckListByBranch/getAssignedCheckListByBranch.query';
import { GetAssignedGroupedCheckListQuery } from 'src/checkList/application/queries/getAssignedGroupedCheckList/GetAssignedGroupedCheckList.query';
import { GetCheckListQuery } from 'src/checkList/application/queries/getCheckList/getCheckList.query';
import { GetCheckListByUserQuery } from 'src/checkList/application/queries/getCheckListByUser/getCheckListByUser.query';
import { GetCheckListByUuidQuery } from 'src/checkList/application/queries/getCheckListByUuid/getCheckListByUuid.query';
import { GetCheckListHistoryQuery } from 'src/checkList/application/queries/getCheckListHistory/getCheckListHistory.query';
import { getCheckListHistoryAnswersByHistoryQuery } from 'src/checkList/application/queries/getCheckListHistoryAnswersByHistory/getCheckListHistoryAnswersByHistory.query';
import { GetCheckListHistoryByBranchQuery } from 'src/checkList/application/queries/getCheckListHistoryByBranch/getCheckListHistoryByBranch.query';
import { GetCheckListHistoryByManagerQuery } from 'src/checkList/application/queries/getCheckListHistoryByManager/getCheckListHistoryByManager.query';
import { GetCheckListHistoryByUserQuery } from 'src/checkList/application/queries/getCheckListHistoryByUser/getCheckListHistoryByUser.query';
import { GetCheckListHistoryByUserAndGroupQuery } from 'src/checkList/application/queries/getCheckListHistoryByUserAndGroup/getCheckListHistoryByUserAndGroup.query';
import { GetCheckListHistoryByUuidQuery } from 'src/checkList/application/queries/getCheckListHistoryByUuid/getChckListHistoryByUuid.query';
import { GetCheckListItemsByCheckListQuery } from 'src/checkList/application/queries/getCheckListItemsByCheckList/getCheckListItemsByCheckList.query';
import { GetCheckListQrByUuidQuery } from 'src/checkList/application/queries/getCheckListQrByUuid/getCheckListQrByUuid.query';
import { GetCriteriaAnswerByCriteriaQuery } from 'src/checkList/application/queries/getCriteriaAnswerByCriteria/getCriteriaAnswerByCriteria.query';
import { GetItemCriteriaByItemQuery } from 'src/checkList/application/queries/getItemCriteriaByItem/getItemCriteriaByItem.query';


@Controller('checklist')
export class CheckListController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) {}

  @Post('create')
  async createCheckList(
    @Body() createCheckListRequest: CreateCheckListRequestDto,
  ) {
    return this.commandBus.execute(
      new CreateCheckListCommand(createCheckListRequest),
    );
  }

  @Get('/:uuid')
  async getCheckListByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListByUuidQuery(uuid));
  }

  @Get()
  async getCheckList(
    @Query('size') size: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
  ) {
    return this.queryBus.execute(new GetCheckListQuery(size, offset, name));
  }

  @Delete('/:uuid')
  async deleteCheckList(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteCheckListCommand(uuid));
  }

  @Put('/:uuid')
  async UpdateCheckList(
    @Param('uuid') uuid: string,
    @Body() request: UpdateCheckListRequestDto,
  ) {
    return this.commandBus.execute(new UpdateCheckListCommand(request, uuid));
  }

  @Post('item/create')
  async createCheckListItem(
    @Body() createCheckListItemRequest: CreateCheckListItemRequestDto,
  ) {
    return this.commandBus.execute(
      new CreateCheckListItemCommand(createCheckListItemRequest),
    );
  }

  @Post('criteria/create')
  async createCheckListItemCriteria(
    @Body()
    createCheckListItemCriteriaRequest: CreateCheckListItemCriteriaRequestDto,
  ) {
    return this.commandBus.execute(
      new CreateCheckListItemCriteriaCommand(
        createCheckListItemCriteriaRequest,
      ),
    );
  }

  @Post('answer/create')
  async createCheckListItemCriteriaAnswer(
    @Body()
    createCheckListItemCriteriaAnswerRequest: CreateCheckListItemCriteriaAnswerRequestDto,
  ) {
    return this.commandBus.execute(
      new CreateCheckListItemCriteriaAnswerCommand(
        createCheckListItemCriteriaAnswerRequest,
      ),
    );
  }

  @Delete('item/:uuid')
  async deleteCheckListItem(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteCheckListItemCommand(uuid));
  }

  @Delete('criteria/:uuid')
  async deleteCheckListItemCriteria(@Param('uuid') uuid: string) {
    return this.commandBus.execute(
      new DeleteCheckListItemCriteriaCommand(uuid),
    );
  }

  @Delete('answer/:uuid')
  async deleteCheckListItemCriteriaAnswer(@Param('uuid') uuid: string) {
    return this.commandBus.execute(
      new DeleteCheckListItemCriteriaAnswerCommand(uuid),
    );
  }

  @Put('item/:uuid')
  async UpdateCheckListItem(
    @Param('uuid') uuid: string,
    @Body() request: UpdateCheckListItemRequestDto,
  ) {
    return this.commandBus.execute(
      new UpdateCheckListItemCommand(request, uuid),
    );
  }

  @Put('criteria/:uuid')
  async UpdateCheckListItemCriteria(
    @Param('uuid') uuid: string,
    @Body() request: UpdateCheckListItemCriteriaRequestDto,
  ) {
    return this.commandBus.execute(
      new UpdateCheckListItemCriteriaCommand(request, uuid),
    );
  }

  @Put('answer/:uuid')
  async UpdateCheckListItemCriteriaAnswer(
    @Param('uuid') uuid: string,
    @Body() request: UpdateCheckListItemCriteriaAnswerRequestDto,
  ) {
    return this.commandBus.execute(
      new UpdateCheckListItemCriteriaAnswerCommand(request, uuid),
    );
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

  @Get('generate-qr/:uuid')
  async getCheckListQrByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListQrByUuidQuery(uuid));
  }

  @Post('item/duplicate')
  async duplicateItem(@Body() duplicateItemRequest: DuplicateItemRequestDto) {
    return this.commandBus.execute(
      new DuplicateItemCommand(duplicateItemRequest),
    );
  }

  @Get('user/:uuid')
  async getCheckListByUser(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListByUserQuery(uuid));
  }

  @Get('assigned/all-users')
  async getAssignedCheckList(
    @Query('size') size: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
    @Query('lastName') lastName: string,
    @Query('secondLastName') secondLastName: string,
    @Query('checkList') checkList: string,
    @Query('weekday') weekday: string,
  ) {
    return this.queryBus.execute(
      new GetAssignedCheckListQuery(
        size,
        offset,
        name,
        lastName,
        secondLastName,
        checkList,
        weekday,
      ),
    );
  }

   @Get('assigned/all-users-grouped')
  async getAssignedCheckListGrouped(
    @Query('size') size: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
    @Query('checkList') checkList: string,
    @Query('weekday') weekday: string,
    @Query('uuid_branch') uuid_branch: string
  ) {
    return this.queryBus.execute(
      new GetAssignedGroupedCheckListQuery(
        size,
        offset,
        name,
        checkList,
        weekday,
        uuid_branch
      ),
    );
  }

  @Post('user/:uuid/answer')
  async answerCheckList(
    @Param('uuid') uuid: string,
    @Body() CreateCheckListUserAnswerRequest: CreateCheckListUserAnswerRequest[],
  ) {
    return this.commandBus.execute(
      new AnswerCheckListCommand(CreateCheckListUserAnswerRequest, uuid),
    );
  }

  @Get('history/all')
  async getAllCheckListHistory(
    @Query('size') size: number,
    @Query('offset') offset,
    @Query('name') name: string,
    @Query('lastName') lastName: string,
    @Query('secondLastName') secondLastName: string,
    @Query('checkList') checkList: string,
    @Query('branch') branch: string,
  ) {
    return this.queryBus.execute(
      new GetCheckListHistoryQuery(
        size,
        offset,
        name,
        lastName,
        secondLastName,
        checkList,
        branch,
      ),
    );
  }

  @Get('user/:uuid/history/')
  async getCheckListHistoryByUser(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListHistoryByUserQuery(uuid));
  }

  @Get('user/:uuidUser/history/group/:uuidGroup')
  async getCheckListHistoryByUserAndGroup(
    @Param('uuidUser') uuidUser: string,
    @Param('uuidGroup') uuidGroup: string,
  ) {
    return this.queryBus.execute(
      new GetCheckListHistoryByUserAndGroupQuery(uuidUser, uuidGroup),
    );
  }

  @Get('history/:uuid/answers')
  async getCheckListHistoryAnswersByHistory(@Param('uuid') uuid: string) {
    return this.queryBus.execute(
      new getCheckListHistoryAnswersByHistoryQuery(uuid),
    );
  }

  @Put('history-status/:uuid')
  async updateHistoryStatus(
    @Param('uuid') uuid: string,
    @Body() request: UpdateHistoryStatusRequestDto,
  ) {
    return this.commandBus.execute(
      new UpdateHistoryStatusCommand(uuid, request),
    );
  }

  @Get('history/report/download')
  async downloadCheckListHistoryReport(
    @Query('initialDate') initialDate: Date,
    @Query('endDate') endDate: Date,
    @Query('branchId') branchId: string,
    @Res() res: Response,
  ) {
    try {
      const excelBuffer = await this.queryBus.execute(
        new DownloadCheckListHistoryReportQuery(initialDate, endDate, branchId),
      );

      // Configurar los encabezados de la respuesta
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');

      // Enviar el buffer como respuesta
      res.status(HttpStatus.OK).send(excelBuffer);
    } catch (error) {
      console.error('Error al generar el Excel:', error);
      res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send('Error al generar el reporte.');
    }
  }

  @Put('reassign-history/:uuid')
  async ReassignHistory(
    @Param('uuid') uuid: string,
    @Body() reassignHistoryRequestDto: ReassignHistoryRequestDto,
  ) {
    return this.commandBus.execute(
      new ReassignHistoryCommand(uuid, reassignHistoryRequestDto),
    );
  }

  @Get('assigned/by-branch/:uuid')
  async getAssignedCheckListByBranch(
    @Param('uuid') uuid: string,
    @Query('size') size: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
    @Query('lastName') lastName: string,
    @Query('secondLastName') secondLastName: string,
    @Query('checkList') checkList: string,
    @Query('weekday') weekday: string,
  ) {
    return this.queryBus.execute(
      new GetAssignedCheckListByBranchQuery(
        uuid,
        size,
        offset,
        name,
        lastName,
        secondLastName,
        checkList,
        weekday,
      ),
    );
  }

  @Get('history/by-branch/:uuid')
  async getCheckListHistoryByBranch(
    @Param('uuid') uuid: string,
    @Query('size') size: number,
    @Query('offset') offset: number,
    @Query('name') name: string,
    @Query('lastName') lastName: string,
    @Query('secondLastName') secondLastName: string,
    @Query('checkList') checkList: string,
    @Query('branch') branch: string,
  ) {
    return this.queryBus.execute(
      new GetCheckListHistoryByBranchQuery(
        uuid,
        size,
        offset,
        name,
        lastName,
        secondLastName,
        checkList,
        branch,
      ),
    );
  }

  @Post('duplicate')
  async duplicateCheckList(
    @Body() duplicateCheckListRequestDto: DuplicateCheckListRequestDto,
  ) {
    return this.commandBus.execute(
      new DuplicateCheckListCommand(duplicateCheckListRequestDto),
    );
  }

  @Post('review/:uuid')
  async reviewCheckListHistory(
    @Param('uuid') uuid: string,
    @Body() reviewCheckListHistoryDto: ReviewCheckListHistoryDto,
  ) {
    return this.commandBus.execute(
      new ReviewCheckListHistoryCommand(uuid, reviewCheckListHistoryDto),
    );
  }

  @Get('history/by-uuid/:uuid')
  async getCheckListHistoryByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetCheckListHistoryByUuidQuery(uuid));
  }

  @Post('manager-review/:uuid')
  async managerReviewCheckListHistory(
    @Param('uuid') uuid: string,
    @Body() managerReviewCheckListHistoryDto: ManagerReviewCheckListHistoryDto,
  ) {
    return this.commandBus.execute(
      new ManagerReviewCheckListHistoryCommand(uuid, managerReviewCheckListHistoryDto),
    );
  }

  @Get(':uuid_checklist/history/by-manager/:uuid_manager')
  async getCheckListHistoryByManager(
    @Param('uuid_checklist') uuidCheckList: string,
    @Param('uuid_manager') uuidManager: string
  ) {
    return this.queryBus.execute(
      new GetCheckListHistoryByManagerQuery(
        uuidCheckList,
        uuidManager
      ),
    );
  }
}
