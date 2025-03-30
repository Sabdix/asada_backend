import { IsNotEmpty } from 'class-validator';

export class AssingScheduleRequestDto {
    @IsNotEmpty()
    uuid_schedule: string;
}