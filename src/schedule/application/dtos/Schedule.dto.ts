import { Expose, Type } from 'class-transformer';
import { ScheduleCalendarDto } from './ScheduleCalendar.dto';
import { CalendarDto } from './Calendar.dto';

export class ScheduleDto {
    @Expose()
    uuid: string;
    @Expose()
    name: string;

    @Expose()
    @Type(() => CalendarDto)
    cheduleCalendar?: CalendarDto[];
}
