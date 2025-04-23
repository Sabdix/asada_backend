import { IsNotEmpty } from 'class-validator';

export class CreateSingleCalendarRequestDto {
    @IsNotEmpty()
    weekDay: number;
  
    @IsNotEmpty()
    initHour: string;
  
    @IsNotEmpty()
    endHour: string;
  
    @IsNotEmpty()
    mealHourNumber: string;
}
