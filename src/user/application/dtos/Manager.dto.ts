import { Expose } from 'class-transformer';

export class ManagerDto {
    @Expose()
    name: string;
  
    @Expose()
    uuid: string;
}