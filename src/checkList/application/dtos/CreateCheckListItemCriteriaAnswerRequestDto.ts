import { IsNotEmpty } from 'class-validator';

export class CreateCheckListItemCriteriaAnswerRequestDto {
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  uuid_check_list_item_criteria: string;
}

