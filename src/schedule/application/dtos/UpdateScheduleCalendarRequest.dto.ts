
import { IsNotEmpty, IsOptional } from 'class-validator';

export class UpdateScheduleCalendarRequestDto {
    @IsNotEmpty()
    @IsOptional()
    weekDay?: number;
  
    @IsNotEmpty()
    @IsOptional()
    initHour?: string;
  
    @IsNotEmpty()
    @IsOptional()
    endHour?: string;
  
    @IsNotEmpty()
    @IsOptional()
    mealHourNumber?: string;
}
