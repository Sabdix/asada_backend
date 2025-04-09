import { Expose, Type } from 'class-transformer';
import { CheckListDto } from './CheckList.dto';
import { SimpleUserDto } from './SimpleUser.dto';

export class CheckListUserDto {
  @Expose()
  uuid: string;
  @Expose()
  uuid_user: string;
  @Expose()
  uuid_check_list: string;
  @Expose()
  weekDay: string;
  @Expose()
  initHour: string;
  @Expose()
  endHour: string;
  @Expose()
  @Type(() => CheckListDto)
  checkList: CheckListDto;
  @Expose()
  @Type(() => SimpleUserDto)
  user: SimpleUserDto;
}

