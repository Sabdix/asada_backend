import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { GetScheduleByUuidQuery } from './GetScheduleByUuid.query';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleDto } from '../../dtos/Schedule.dto';

@QueryHandler(GetScheduleByUuidQuery)
export class GetScheduleByUuidQueryHandler implements IQueryHandler<GetScheduleByUuidQuery> {
  constructor(private  scheudleService: ScheduleService) {}

  async execute(query: GetScheduleByUuidQuery) {
    const schedule = await this.scheudleService.getScheduleByUuid(query.uuid);

    if (!schedule) return WsResponse.buildNotFoundResponse('SCHEDULE NOT FOUND');

    return WsResponse.buildOkResponse(
      plainToInstance(ScheduleDto, schedule, { excludeExtraneousValues: true }),
    );
  }
}
