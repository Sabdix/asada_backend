import { Expose, Type } from 'class-transformer';
import { RoleDto } from './Role.dto';
import { ManagerDto } from './Manager.dto';
import { UserBranchDto } from './UserBranch.dto';
import { UserScheduleDto } from './UserSchedule.dto';
import { WorkAreaDto } from './WorkArea.dto';

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

    @Expose()
    empowered: boolean;

    @Expose()
    stock_empowered: boolean;
  
    @Expose()
    @Type(() => RoleDto)
    role: RoleDto;

    @Expose()
    @Type(() => ManagerDto)
    manager: ManagerDto | null;

    @Expose()
    @Type(() => UserBranchDto)
    branch: UserBranchDto;

    @Expose()
    @Type(() => UserScheduleDto)
    schedule: UserScheduleDto;

    @Expose()
    @Type(() => WorkAreaDto)
    workArea: WorkAreaDto | null;
}
