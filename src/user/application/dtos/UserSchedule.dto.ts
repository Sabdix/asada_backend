import { Expose } from 'class-transformer';

export class UserScheduleDto {
    @Expose()
    uuid: string;
    @Expose()
    name: string;
}
