import { IsNotEmpty } from 'class-validator';
import { CreateScheduleCalendarRequestDto } from './CreateScheduleCalendarRequest.dto';
import { CreateSingleCalendarRequestDto } from './CreateSingleCalendar.dto';
import { Type } from 'class-transformer';

export class CreateScheduleRequestDto {
    @IsNotEmpty()
    name: string;

    @IsNotEmpty()
    @Type(() => CreateSingleCalendarRequestDto)
    calendars: CreateSingleCalendarRequestDto[]
}
