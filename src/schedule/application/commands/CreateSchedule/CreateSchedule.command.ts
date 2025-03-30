import { Command } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { CreateScheduleRequestDto } from '../../dtos/CreateScheduleRequest.dto';


export class CreateScheduleCommand extends Command<WsResponse< ScheduleDto | string>> {
  constructor(public body: CreateScheduleRequestDto) {
    super();
  }
}
