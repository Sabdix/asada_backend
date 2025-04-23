import { Expose } from 'class-transformer';

export class CheckListUserAnswersDto {
    @Expose()
    uuid_check_list_history: string;

    @Expose()
    uuid_check_list_item_criteria_answer: string;

    @Expose()
    comment: string;
}