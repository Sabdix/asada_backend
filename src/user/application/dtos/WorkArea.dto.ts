import { Expose } from 'class-transformer';

export class WorkAreaDto {
    @Expose()
    name: string;
  
    @Expose()
    uuid: string;
}