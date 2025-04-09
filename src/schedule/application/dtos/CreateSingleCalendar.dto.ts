import { IsNotEmpty } from 'class-validator';

export class CreateSingleCalendarRequestDto {
    @IsNotEmpty()
    weekDay: number;
  
    @IsNotEmpty()
    initHour: number;
  
    @IsNotEmpty()
    endHour: number;
  
    @IsNotEmpty()
    mealHourNumber: number;
}
