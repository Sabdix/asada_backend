import { Expose, Type } from 'class-transformer';
import { CheckListItemCriteriaDto } from './CheckListItemCriteria.dto';

export class AnswerByCriteriaDto {
    @Expose()
    text: string;
  
    @Expose()
    uuid: string;
}