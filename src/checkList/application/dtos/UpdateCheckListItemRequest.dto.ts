import { Optional } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';

export class UpdateCheckListItemRequestDto {
  @Optional()
  name: string;
  @Optional()
  uuid_check_list: string;
}
