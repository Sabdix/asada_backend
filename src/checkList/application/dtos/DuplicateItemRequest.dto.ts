import { IsNotEmpty } from 'class-validator';

export class DuplicateItemRequestDto {
  @IsNotEmpty()
  name: string;
  @IsNotEmpty()
  uuid_check_list_item: string;
}

