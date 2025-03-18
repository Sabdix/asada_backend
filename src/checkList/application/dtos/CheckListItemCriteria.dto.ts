import { Expose, Type } from 'class-transformer';
import { CheckListDto } from './CheckList.dto';
import { CheckListItemDto } from './CheckListItem.dto';

export class CheckListItemCriteriaDto {
    @Expose()
    text: string;
  
    @Expose()
    uuid: string;

    @Expose()
    @Type(() => CheckListItemDto)
    check_list_item: CheckListItemDto;
}