import { Expose } from "class-transformer";

export class ScheduleCalendarDto {
    @Expose()
    uuid: string;

    @Expose()
    weekDay: number[];
  
    @Expose()
    initHour: number;
  
    @Expose()
    endHour: number;
  
    @Expose()
    mealHourNumber: number;
  
    @Expose()
    uuid_schedule: string;
}
