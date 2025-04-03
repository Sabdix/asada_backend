import { Body, Controller, Delete, Get, Param, Post, Put } from "@nestjs/common";
import { CommandBus, QueryBus } from "@nestjs/cqrs";
import { CreateScheduleCommand } from "src/schedule/application/commands/CreateSchedule/CreateSchedule.command";
import { CreateScheduleCalendarCommand } from "src/schedule/application/commands/CreateScheduleCalendar/CreateScheduleCalendar.command";
import { DeleteScheduleCommand } from "src/schedule/application/commands/DeleteSchedule/DeleteSchedule.command";
import { DeleteScheduleCalendarCommand } from "src/schedule/application/commands/DeleteScheduleCalendar/DeleteScheduleCalendar.command";
import { UpdateScheduleCommand } from "src/schedule/application/commands/UpdateSchedule/UpdateSchedule.command";
import { UpdateScheduleCalendarCommand } from "src/schedule/application/commands/UpdateScheduleCalendar/UpdateScheduleCalendar.command";
import { CreateScheduleCalendarRequestDto } from "src/schedule/application/dtos/CreateScheduleCalendarRequest.dto";
import { CreateScheduleRequestDto } from "src/schedule/application/dtos/CreateScheduleRequest.dto";
import { UpdateScheduleCalendarRequestDto } from "src/schedule/application/dtos/UpdateScheduleCalendarRequest.dto";
import { UpdateScheduleRequestDto } from "src/schedule/application/dtos/UpdateScheduleRequest.dto";
import { GetScheduleByUuidQuery } from "src/schedule/application/queries/GetScheduleByUuid/GetScheduleByUuid.query";
import { GetSchedulesQuery } from "src/schedule/application/queries/GetSchedules/GetSchedules.query";
import { GetScheduleCalendarByScheduleQuery } from "src/schedule/application/queries/GetSchueduleCalendarBySchedule/GetScheduleCalendarBySchedule.query";

@Controller('schedule')
export class scheduleController {
  constructor(
    private commandBus: CommandBus,
    private queryBus: QueryBus,
  ) { }

  @Post('create')
  async createSchedule(@Body() createScheduleRequestDto: CreateScheduleRequestDto) {
    return this.commandBus.execute(new CreateScheduleCommand(createScheduleRequestDto));
  }

  @Get('/:uuid')
  async getSchedulehByUuid(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetScheduleByUuidQuery(uuid));
  }

  @Get('')
  async getSchedules() {
    return this.queryBus.execute(new GetSchedulesQuery());
  }

  @Delete('/:uuid')
  async deleteSchedule(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteScheduleCommand(uuid));
  }

  @Put('/:uuid')
  async UpdateSchedule(@Param('uuid') uuid: string, @Body() request: UpdateScheduleRequestDto) {
    return this.commandBus.execute(new UpdateScheduleCommand(request, uuid));
  }

  @Post('create-calendar/:uuid')
  async createScheduleCalendar(@Body() createScheduleCalendarRequestDto: CreateScheduleCalendarRequestDto, @Param('uuid') uuid: string) {
    return this.commandBus.execute(new CreateScheduleCalendarCommand(createScheduleCalendarRequestDto, uuid));
  }

  @Get('calendar/:uuid')
  async getScheduleCalendarBySchedule(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetScheduleCalendarByScheduleQuery(uuid));
  }

  @Delete('calendar/:uuid')
  async deleteScheduleCalendar(@Param('uuid') uuid: string) {
    return this.commandBus.execute(new DeleteScheduleCalendarCommand(uuid));
  }

  @Put('calendar/:uuid')
  async updateScheduleCalendar(@Param('uuid') uuid: string,  @Body() request: UpdateScheduleCalendarRequestDto) {
    return this.commandBus.execute(new UpdateScheduleCalendarCommand(request, uuid));
  }

  @Get('user/:uuid')
  async getScheduleByUser(@Param('uuid') uuid: string) {
    return this.queryBus.execute(new GetScheduleCalendarByScheduleQuery(uuid));
  }
}
