import { Expose } from 'class-transformer';

export class CheckListDto {
    @Expose()
    name: string;
  
    @Expose()
    uuid: string;
}