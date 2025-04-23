import { IsNotEmpty } from 'class-validator';

export class CreateScheduleCalendarRequestDto {
    @IsNotEmpty()
    weekDay: number[];
  
    @IsNotEmpty()
    initHour: string;
  
    @IsNotEmpty()
    endHour: string;
  
    @IsNotEmpty()
    mealHourNumber: string;
}
