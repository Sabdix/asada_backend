import { Exclude, Expose, Type } from 'class-transformer';
import { RoleDto } from './Role.dto';
import { ManagerDto } from './Manager.dto';
import { UserBranchDto } from './UserBranch.dto';

export class UserDto {
    @Expose()
    uuid: string;

    @Expose()
    name: string;
  
    @Expose()
    last_name: string;
  
    @Expose()
    second_last_name: string;
  
    @Expose()
    phone: string;
  
    @Expose()
    mail: string;
  
    @Exclude()
    uuid_schedule: string;
  
    @Expose()
    @Type(() => RoleDto)
    role: RoleDto;

    @Expose()
    @Type(() => ManagerDto)
    manager: ManagerDto;

    @Expose()
    @Type(() => UserBranchDto)
    branch: UserBranchDto;
}
