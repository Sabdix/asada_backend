import { Expose } from 'class-transformer';

export class UserBranchDto {
    @Expose()
    name: string;
  
    @Expose()
    uuid: string;

    @Expose()
    lng: number;

    @Expose()
    lat: number;
}