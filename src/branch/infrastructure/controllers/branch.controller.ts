import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query, Res } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { Response } from "express";
import { CreateBranchCommand } from "src/branch/application/commands/CreateBranch/CreateBranch.command";
import { CreateBranchReviewCommand } from "src/branch/application/commands/CreateBranchReview/CreateBranchReview.command";
import { DeleteBranchCommand } from "src/branch/application/commands/DeleteBranch/DeleteBranch.command";
import { UpdateBranchCommand } from "src/branch/application/commands/UpdateBranch/UpdateBranch.command";
import { CreateBranchRequestDto } from "src/branch/application/dtos/CreateBranchRequest.dto";
import { CreateBranchReviewRequestDto } from "src/branch/application/dtos/CreateBranchReviewRequest.dto";
import { UpdateBranchRequestDto } from "src/branch/application/dtos/UpdateBranchRequest.dto";
import { DownloadReviewReportQuery } from "src/branch/application/queries/DownloadReviewReport/DownloadReviewReport.query";
import { DownloadReviewReport64Query } from "src/branch/application/queries/DownloadReviewReport64/DownloadReviewReport64.query";
import { GetBranchByUuidQuery } from "src/branch/application/queries/GetBranchByUuid/GetBranchByUuid.query";
import { GetBranchesQuery } from "src/branch/application/queries/GetBranches/GetBranches.query";
import { GetBranchQrByUuidQuery } from "src/branch/application/queries/GetBranchQrByUuid/GetBranchQrByUuid.query";
import { GetBranchReviewsQuery } from "src/branch/application/queries/GetBranchReviews/GetBranchReviews.query";
import { GetBranchReviewsByUuidQuery } from "src/branch/application/queries/GetBranchReviewsByUuid/GetBranchReviewsByUuid.query";


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
  async UpdateBranch(@Param('uuid') uuid: string, @Body() request: UpdateBranchRequestDto) {
    return this.commandBus.execute(new UpdateBranchCommand(request, uuid));
  }

  @Get('generate-qr/:uuid')
  async getBranchQrByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetBranchQrByUuidQuery(uuid));
  }

  @Post('review/:uuid')
  async CreateBranchReview(@Param('uuid') uuid: string, @Body() createBranchReviewRequestDto: CreateBranchReviewRequestDto) {
    return this.commandBus.execute(new CreateBranchReviewCommand(uuid, createBranchReviewRequestDto));
  }

  @Get('review/all')
  async getBranchReviews() {
    return this.queryBus.execute(new GetBranchReviewsQuery());
  }

  @Get('review/:uuid')
  async getBranchReviewsByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetBranchReviewsByUuidQuery(uuid));
  }

  @Get('review/report/download')
  async downloadReviewReport(@Query('initialDate') initialDate: Date, @Query('endDate') endDate: Date, @Query('branchId') branchId: string, @Res() res: Response) {
    //return this.queryBus.execute(new DownloadReviewReportQuery(initialDate, endDate));

    try {

      const excelBuffer = await this.queryBus.execute(new DownloadReviewReportQuery(initialDate, endDate, branchId));

      // Configurar los encabezados de la respuesta
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
      res.setHeader('Content-Disposition', 'attachment; filename=reporte.xlsx');

      // Enviar el buffer como respuesta
      res.status(HttpStatus.OK).send(excelBuffer);
    } catch (error) {
      console.error('Error al generar el Excel:', error);
      res.status(HttpStatus.INTERNAL_SERVER_ERROR).send('Error al generar el reporte.');
    }
  }

  @Get('review/report/download-64')
  async downloadReviewReport64(@Query('initialDate') initialDate: Date, @Query('endDate') endDate: Date) {
    return this.queryBus.execute(new DownloadReviewReport64Query(initialDate, endDate));

  }
}
