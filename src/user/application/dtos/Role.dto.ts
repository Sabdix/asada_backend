import { Expose } from 'class-transformer';

export class RoleDto {
    @Expose()
    name: string;

    @Expose()
    hierarchy: string;
  
    @Expose()
    uuid: string;
}