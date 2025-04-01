import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { WsResponse } from 'src/common/dtos/WsResponse.dto';
import { plainToInstance } from 'class-transformer';
import { ScheduleService } from '../../services/schedule.service';
import { ScheduleDto } from '../../dtos/Schedule.dto';
import { GetScheduleCalendarByScheduleQuery } from './GetScheduleCalendarBySchedule.query';
import { ScheduleCalendarService } from '../../services/scheduleCalendar.service';
import { ScheduleCalendarDto } from '../../dtos/ScheduleCalendar.dto';

@QueryHandler(GetScheduleCalendarByScheduleQuery)
export class GetScheduleCalendarByScheduleQueryHandler implements IQueryHandler<GetScheduleCalendarByScheduleQuery> {
    constructor(
        private scheduleCalendarService: ScheduleCalendarService,
        private scheudleService: ScheduleService
    ) { }

    async execute(query: GetScheduleCalendarByScheduleQuery) {
        const schedule = await this.scheudleService.getScheduleByUuid(query.uuid);

        if (!schedule) return WsResponse.buildNotFoundResponse('SCHEDULE NOT FOUND');

        const scheduleCalendar = await this.scheduleCalendarService.getScheduleCalendarBySchedule(query.uuid)

        return WsResponse.buildOkResponse(
            plainToInstance(ScheduleCalendarDto, scheduleCalendar, { excludeExtraneousValues: true }),
        );
    }
}
