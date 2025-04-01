import { Injectable } from '@nestjs/common';
import { ScheduleCalendarRepository } from 'src/schedule/infrastructure/repositories/ScheduleCalendar.repository';
import { CreateScheduleCalendarRequestDto } from '../dtos/CreateScheduleCalendarRequest.dto';
import { ScheduleCalendar } from 'src/schedule/domain/entities/ScheduleCalendar.entity';

@Injectable()
export class ScheduleCalendarService {
    constructor(private readonly scheduleCalendarRepository: ScheduleCalendarRepository) { }

    creteScheduleCalendar(request: CreateScheduleCalendarRequestDto, weekDay: number, uuid_schedule: string) {
        return this.scheduleCalendarRepository.save(
            this.scheduleCalendarRepository.create({
                endHour: request.endHour,
                initHour: request.initHour,
                mealHourNumber: request.mealHourNumber,
                uuid_schedule: uuid_schedule,
                weekDay: weekDay
            })
        )
    }

    getScheduleCalendarBySchedule(uuid: string) {
        return this.scheduleCalendarRepository.findBy({ uuid_schedule: uuid });
    }

    getScheduleCalendarByUuid(uuid: string) {
        return this.scheduleCalendarRepository.findOneBy({ uuid: uuid });
    }

    deleteScheduleCalendar(uuid: string) {
        return this.scheduleCalendarRepository.softDelete({ uuid: uuid });
    }

    UpdateScheduleCalendar(schedule: ScheduleCalendar) {
        return this.scheduleCalendarRepository.save(schedule);
    }
}
