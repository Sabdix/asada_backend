import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import {  GetSchedulesQuery } from './GetSchedules.query';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { ScheduleService } from '../../services/schedule.service';

@QueryHandler(GetSchedulesQuery)
export class GetSchedulesQueryHandler implements IQueryHandler<GetSchedulesQuery> {
  constructor(private  scheduleService: ScheduleService) {}

  async execute(): Promise<WsResponse<ScheduleDto[]>> {
    const schedules = await this.scheduleService.getScheudules();

    return WsResponse.buildOkResponse(
      plainToInstance(ScheduleDto, schedules, { excludeExtraneousValues: true }),
    );
  }
}
