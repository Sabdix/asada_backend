import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ScheduleDto } from '../../dtos/Schedule.dto';

export class GetSchedulesQuery extends Query<WsResponse<ScheduleDto[] | string>> {
  constructor() {
    super();
  }
}
