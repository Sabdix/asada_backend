import { Expose, Type } from 'class-transformer';
import { CheckListDto } from './CheckList.dto';
import { CheckListItemDto } from './CheckListItem.dto';
import { AnswerByCriteriaDto } from './AnswerByCriteria.dto';

export class CriteriaByItemDto {
    @Expose()
    text: string;
  
    @Expose()
    uuid: string;

    @Expose()
    @Type(() => AnswerByCriteriaDto)
    checkListItemCriteria?: AnswerByCriteriaDto[];
}