import { IsNotEmpty } from 'class-validator';

export class CreateScheduleRequestDto {
    @IsNotEmpty()
    name: string;
}
