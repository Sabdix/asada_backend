import { IsNotEmpty } from 'class-validator';

export class CreateCheckListItemCriteriaRequestDto {
  @IsNotEmpty()
  text: string;
  @IsNotEmpty()
  uuid_check_list_item: string;
}

