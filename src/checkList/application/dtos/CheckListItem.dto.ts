import { Expose, Type } from 'class-transformer';
import { CheckListDto } from './CheckList.dto';

export class CheckListItemDto {
    @Expose()
    name: string;
  
    @Expose()
    uuid: string;

    @Expose()
    @Type(() => CheckListDto)
    check_list: CheckListDto;
}