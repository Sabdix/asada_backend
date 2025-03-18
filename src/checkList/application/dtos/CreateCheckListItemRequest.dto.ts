import { IsNotEmpty } from 'class-validator';

export class CreateCheckListItemRequestDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  uuid_check_list: string;
}

