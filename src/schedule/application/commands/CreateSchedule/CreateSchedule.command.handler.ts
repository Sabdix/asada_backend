import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { CreateScheduleCommand } from './CreateSchedule.command';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { ScheduleService } from '../../services/schedule.service';

@CommandHandler(CreateScheduleCommand)
export class CreateScheduleCommandHandler implements ICommandHandler<CreateScheduleCommand> {
  constructor(
    private scheduleService: ScheduleService,
  ) {}

  async execute(command: CreateScheduleCommand): Promise<WsResponse<ScheduleDto | string>> {

    if (await this.scheduleService.getScheduleByName(command.body.name))
        return WsResponse.buildConflictResponse('YA EXISTE UN HORARIO CON ESE NOMBRE','SCHEDULE ALREADY EXISTS');

    const schedule = await this.scheduleService.creteSchedule(command.body)

    return WsResponse.buildOkResponse(
      plainToInstance(ScheduleDto, schedule, { excludeExtraneousValues: true }),
    );
  }
}
