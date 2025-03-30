import { Expose } from 'class-transformer';

export class UpdateScheduleRequestDto {
    @Expose()
    name: string;
}
