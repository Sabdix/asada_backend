
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateScheduleCalendarRequestDto {
    @IsNotEmpty()
    @IsOptional()
    weekDay?: number;
  
    @IsNotEmpty()
    @IsOptional()
    initHour?: number;
  
    @IsNotEmpty()
    @IsOptional()
    endHour?: number;
  
    @IsNotEmpty()
    @IsOptional()
    mealHourNumber?: number;
}
