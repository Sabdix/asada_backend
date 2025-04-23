import { isNotEmpty, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateCheckListUserAnswerRequest {
    @IsOptional()
    comment: string;
    @IsNotEmpty()
    uuid_check_list_item_criteria_answer: string
    @IsNotEmpty()
    uuid_check_list_history: string
}

