import { Expose, Type } from 'class-transformer';

export class CheckDto {
    @Expose()
    name: string;
  
    @Expose()
    uuid: string;
}