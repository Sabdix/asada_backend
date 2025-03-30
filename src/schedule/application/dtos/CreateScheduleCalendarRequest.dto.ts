import { IsNotEmpty } from 'class-validator';

export class CreateScheduleCalendarRequestDto {
    @IsNotEmpty()
    weekDay: number[];
  
    @IsNotEmpty()
    initHour: number;
  
    @IsNotEmpty()
    endHour: number;
  
    @IsNotEmpty()
    mealHourNumber: number;
}
