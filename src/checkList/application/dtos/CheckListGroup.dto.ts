import { Expose, Type } from 'class-transformer';

export class CheckListInGroupDto {
  @Expose()
  uuid_check_list: string;

  @Expose()
  priority: number;

  @Expose()
  checkListName?: string;
}

export class CheckListGroupDto {
  @Expose()
  name: string;

  @Expose()
  uuid: string;

  @Expose()
  @Type(() => CheckListInGroupDto)
  checkLists?: CheckListInGroupDto[];
}
