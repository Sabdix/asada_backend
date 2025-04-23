import { Expose, Type } from 'class-transformer';
import { CheckListItemCriteriaDto } from './CheckListItemCriteria.dto';

export class CheckListItemCriteriaAnswerDto {
    @Expose()
    text: string;

    @Expose()
    uuid: string;

    @Expose()
    requieres_action: string;

    @Expose()
    @Type(() => CheckListItemCriteriaDto)
    check_list_item_criteria: CheckListItemCriteriaDto;
}