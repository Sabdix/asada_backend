import { IsOptional } from 'class-validator';

export class UpdateCheckListItemCriteriaAnswerRequestDto {
  @IsOptional()
  text: string;
  @IsOptional()
  uuid_check_list_item_criteria: string;
  @IsOptional()
  requieres_action: boolean;
}
