import { Expose, Type } from 'class-transformer';
import { AnswerDto } from './Answer.dto';


export class CheckListUserAnswersDto {
    @Expose()
    uuid_check_list_history: string;

    @Expose()
    uuid_check_list_item_criteria_answer: string;

    @Expose()
    comment: string;

    @Expose()
    @Type(() => AnswerDto)
    check_list_criteria_answer?: AnswerDto;
}