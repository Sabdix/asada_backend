import { Expose } from 'class-transformer';

export class ScheduleDto {
    @Expose()
    uuid: string;
    @Expose()
    name: string;
}
