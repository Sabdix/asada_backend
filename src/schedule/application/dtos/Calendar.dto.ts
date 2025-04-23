import { Expose } from "class-transformer";

export class CalendarDto {
    @Expose()
    uuid: string;

    @Expose()
    weekDay: number;
  
    @Expose()
    initHour: string;
  
    @Expose()
    endHour: string;
  
    @Expose()
    mealHourNumber: string;
  
    @Expose()
    uuid_schedule: string;
}
