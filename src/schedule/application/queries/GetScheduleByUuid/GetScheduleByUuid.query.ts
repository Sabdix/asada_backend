import { Query } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ScheduleDto } from '../../dtos/Schedule.dto';

export class GetScheduleByUuidQuery extends Query<WsResponse<ScheduleDto | string>> {
  constructor(public readonly uuid: string) {
    super();
  }
}
