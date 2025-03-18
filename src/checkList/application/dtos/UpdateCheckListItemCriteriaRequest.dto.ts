import { IsOptional } from 'class-validator';

export class UpdateCheckListItemCriteriaRequestDto {
  @IsOptional()
  text: string;
  @IsOptional()
  uuid_check_list_item: string;
}
