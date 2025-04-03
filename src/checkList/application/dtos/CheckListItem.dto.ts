import { Expose, Type } from 'class-transformer';
import { CheckListDto } from './CheckList.dto';
import { CheckListItemCriteriaDto } from './CheckListItemCriteria.dto';
import { CriteriaByItemDto } from './CriteriaByItem.dto';

export class CheckListItemDto {
    @Expose()
    name: string;
  
    @Expose()
    uuid: string;

    @Expose()
    @Type(() => CheckListDto)
    check_list: CheckListDto;

    @Expose()
    @Type(() => CriteriaByItemDto)
    checkListItemCriteria?: CriteriaByItemDto[];
}