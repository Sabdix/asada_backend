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
  weekDay: number;
  @Expose()
  initHour: string;
  @Expose()
  endHour: string;
  @Expose()
  specialEvent: boolean;
  @Expose()
  eventDate: Date;
  @Expose()
  @Type(() => CheckListDto)
  checkList: CheckListDto;
  @Expose()
  @Type(() => SimpleUserDto)
  user: SimpleUserDto;
}

