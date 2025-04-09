import { Exclude, Expose, Type } from 'class-transformer';

export class SimpleUserDto {
    @Expose()
    uuid: string;

    @Expose()
    name: string;

    @Expose()
    last_name: string;

    @Expose()
    second_last_name: string;

}
